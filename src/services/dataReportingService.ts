import { MultiValueSensor } from '../homeassistant/sensors/sensors';
import { IAcuriteData } from '../acuparse/acurite.types';
import { createSensor } from '../homeassistant/sensors';
import { AsyncTask, JobStatus, SimpleIntervalJob } from 'toad-scheduler';
import { clearTopic, publish, subscribe, unsubscribe } from '../mqtt/mqttComms';
import { getScheduler } from './jobScheduler';
import debug from 'debug';
import { IMQTTSensor } from '../@types/homeassistant';
import _ from 'lodash';
import { logSensorPublish } from './statistics';
import { Mutex } from 'async-mutex';

const reportingLog = debug('acuparse-mqtt:dataReportingService');
const submitLog = reportingLog.extend('publishSensorStates');
const configLog = reportingLog.extend('sensorConfig');
const configLogCheckPub = configLog.extend('checkPublished');

/**
 * Converts 'setTimeout' to a promise based function.
 *
 * @param duration - Duration of the sleep in milliseconds.
 * @returns - Returns a promise that resolves when the duration has passed
 */
function sleepPromise(duration: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

/**
 * Centralized data reporting service. This is responsible for aggregating sensor data, and reporting that
 * data at regular intervals. This throttles the sending of sensor data to ensure we only update sensor data at 1 minute
 * intervals.
 */
class DataReportingService {
  /**
   * Stores sensors that need to be reported to the MQTT broker.
   *
   * @private
   */
  private readonly dataStore = new Map<string, MultiValueSensor>();

  /**
   * Stores the sensor specific periodic reporting jobs.
   *
   * @private
   */
  private readonly jobStore = new Map<string, SimpleIntervalJob>();

  /**
   * We only want to report the sensor configuration once per startup for each sensor. This keeps track of which
   * sensors we have reported status for.
   *
   * @private
   */
  private readonly sentConfigs = new Set<string>;

  private readonly configMutex = new Mutex();

  /**
   * Accepts an Acurite // Acuparse sensor reading, creates a Home Assistant style CompositeSensor, stores the latest
   * data from that sensor, and schedules it for being reported to the MQTT broker.
   *
   * @param acuriteData - Acurite // Acuparse data we have received.
   */
  public async addSensorReading(acuriteData: IAcuriteData): Promise<void> {
    // Save the sensor value
    const sensor = await createSensor(acuriteData);

    // Publish the sensor configuration
    await this.publishSensorConfig(sensor);

    this.dataStore.set(sensor.getSensorID(), sensor);

    // Ensure the job is running.
    this.startJob(sensor.getSensorID());
  }

  /**
   * Centralized reporting of the sensor's configuration.
   *
   * @param sensor - Sensor to submit configuration information for.
   * @protected
   */
  protected async publishSensorConfig(sensor: MultiValueSensor): Promise<void> {
    const sensorID = sensor.getSensorID();

    // Check if we need to send the sensor configs
    if (!this.sentConfigs.has(sensorID)) {
      const sensorConfig = sensor.getConfiguration();

      // We should only publish a configuration in rare circumstances, ideally never, but during development
      // it is nice to be able to dynamically determine if the sensors configurations have changed.
      if (!(await this.checkPublishedConfig(sensorID, sensorConfig))) {
        configLog('Publishing config data for %s', sensorID);

        for (const [configTopic, config] of sensorConfig) {
          // Ensure we delete any pre-existing topics related to this.
          await clearTopic(configTopic);

          // Publish the new configuration.
          await publish(configTopic, config, { retain: true });
        }
      }

      // Ensure we don't do this again for this runtime.
      this.sentConfigs.add(sensorID);
    }
  }

  /**
   * This verifies the current sensor configuration vs. the published sensor configuration.
   *
   * @param sensorID - Sensor ID, used for logging.
   * @param sensorConfig - Sensor configuration to compare against.
   * @returns - True if the configurations match, false otherwise.
   * @protected
   */
  protected async checkPublishedConfig(sensorID: string, sensorConfig: [string, IMQTTSensor][]): Promise<boolean> {
    const fullConfiguration = sensorConfig;

    //todo: It is probably worth considering alternatives to this, or creating the mutex on a per-sensor basis.
    //      as it stands now, checking ANY sensor's configuration blocks ALL sensors from checking their configuration.
    //      this doesn't have to be the case.
    const release = await this.configMutex.acquire();

    let result: boolean;

    try {
      // Check if we can bail out early
      if (this.sentConfigs.has(sensorID)) {
        configLogCheckPub('Sensor configuration already checked for %s', sensorID);
        release();
        return true;
      }

      // Subscribe to all the configuration topics
      configLogCheckPub('Subscribing to configuration topics for %s...', sensorID);
      const receivedFullConfiguration = new Map<string, IMQTTSensor>();
      for (const [topic] of fullConfiguration) {
        await subscribe(topic, (buffer) => {
          configLogCheckPub('Received: %s', topic);
          const jsonConfig = buffer.toString();
          const receivedConfig = JSON.parse(jsonConfig);
          receivedFullConfiguration.set(topic, receivedConfig as IMQTTSensor);
        });
      }

      // Give it 1000 milliseconds for the topics to send back retained values.
      const waitIterations = 5;
      const waitDuration = 200;
      for (let i = 0; i < waitIterations && receivedFullConfiguration.size !== fullConfiguration.length; ++i) {
        await sleepPromise(waitDuration);
      }

      // Ensure we are no longer subscribed to these topics.
      for (const [topic] of fullConfiguration) {
        await unsubscribe(topic);
      }

      // Check if the published configuration == actual configuration.
      result = fullConfiguration.length === receivedFullConfiguration.size;

      if (result) {
        for (const [topic, config] of fullConfiguration) {
          const publishedConfig = receivedFullConfiguration.get(topic);
          if (publishedConfig === undefined) {
            result = false;
            break;
          } else if (!_.isEqual(config, publishedConfig)) {
            result = false;
            break;
          }
        }
      }

      if (!result) {
        configLogCheckPub('Published != current');
      } else {
        this.sentConfigs.add(sensorID);
        configLogCheckPub('Published == current');
      }
    } catch (err) {
      result = false;
      configLogCheckPub('Error while checking published configuration. %s', err);
    } finally {
      release();
    }

    return result;
  }

  /**
   * Handles reporting a specific sensor ID to the MQTT broker.
   *
   * @param sensorID - Sensor ID to report
   * @protected
   */
  protected async publishSensorStates(sensorID: string): Promise<void> {
    try {
      const sensor = this.dataStore.get(sensorID);
      if (!sensor) {
        submitLog('Finished reporting for sensor ID %s, stopping the job', sensorID);
        this.jobStore.get(sensorID)?.stop();
      } else {

        submitLog('Publishing state data for %s', sensorID);

        logSensorPublish(sensor);

        // Ok... now submit the sensor state info
        const stateMap = sensor.getState();
        for (const [stateTopic, state] of stateMap) {
          await publish(stateTopic, state.payload);
        }

        // Finally, pause this job since we just sent the data.
        this.dataStore.delete(sensorID);
      }
    } catch (err) {
      submitLog('Encountered an error publishing for %s: %s', sensorID, err);
    }
  }

  /**
   * This ensures the sensor's reporting job exists & is started.
   *
   * @param sensorID - Sensor to start the job for.
   * @protected
   */
  protected startJob(sensorID: string): void {
    let curJob = this.jobStore.get(sensorID);
    if (!curJob) {
      const taskFunc = (): Promise<void> => (this.publishSensorStates(sensorID));

      const task = new AsyncTask(
        `submitStatus[${sensorID}]`,
        taskFunc,
        (err: Error) => {
          reportingLog('Encountered an error while running submitStatus(%s): %s', sensorID, err);
        }
      );

      curJob = new SimpleIntervalJob({ minutes: 1, runImmediately: true }, task);
      this.jobStore.set(sensorID, curJob);

      reportingLog('Starting job for sensor: %s', sensorID);

      getScheduler().addSimpleIntervalJob(curJob);
    }

    if (curJob.getStatus() !== JobStatus.RUNNING) {
      curJob.start();
    }
  }
}

const dataReportingService = new DataReportingService();

export default dataReportingService;