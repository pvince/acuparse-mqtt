import { MultiValueSensor } from '../homeassistant/sensors/sensors';
import { IAcuriteData } from '../acuparse/acurite.types';
import { createSensor } from '../homeassistant/sensors';
import { AsyncTask, JobStatus, SimpleIntervalJob } from 'toad-scheduler';
import { clearTopic, publish, subscribe, unsubscribe } from '../mqtt/mqttComms';
import { getScheduler } from './jobScheduler';
import debug from 'debug';
import { IMQTTSensor } from '../@types/homeassistant';
import _ from 'lodash';

const reportingLog = debug('acuparse-mqtt:dataReportingService');

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
   * Checks if this data reporting service has previously encountered this sensor.
   *
   * @param sensorID - ID of the sensor to check
   * @returns - True if the sensor has been encountered.
   */
  public hasEncounteredSensor(sensorID: string): boolean {
    return this.dataStore.has(sensorID) || this.jobStore.has(sensorID);
  }

  /**
   * Centralized reporting of the sensor's configuration.
   *
   * @param sensor - Sensor to submit configuration information for.
   * @protected
   */
  protected async publishSensorConfig(sensor: MultiValueSensor): Promise<void> {
    const configLog = reportingLog.extend('sensorConfig');
    const sensorID = sensor.getSensorID();

    // Check if we need to send the sensor configs
    if (!this.sentConfigs.has(sensorID)) {
      const sensorConfig = sensor.getConfiguration();

      // We should only publish a configuration in rare circumstances, ideally never, but during development
      // it is it is nice to be able to dynamically determine if the sensors configurations have changed.
      if (!(await this.checkPublishedConfig(sensorConfig))) {
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
   * @param sensorConfig - Sensor configuration to compare against.
   * @returns - True if the configurations match, false otherwise.
   * @protected
   */
  protected async checkPublishedConfig(sensorConfig: [string, IMQTTSensor][]): Promise<boolean> {
    const configLog = reportingLog.extend('sensorConfig:checkPublished');

    const fullConfiguration = sensorConfig;

    // Subscribe to all the configuration topics
    configLog('Subscribing to configuration topics...');
    const receivedFullConfiguration = new Map<string, IMQTTSensor>();
    for (const [topic] of fullConfiguration) {
      await subscribe(topic, (buffer) => {
        configLog('Received: %s', topic);
        const jsonConfig = buffer.toString();
        const receivedConfig = JSON.parse(jsonConfig);
        receivedFullConfiguration.set(topic, receivedConfig as IMQTTSensor);
      });
    }

    // Give it 500 milliseconds for the topics to send back retained values.
    const waitIterations = 5;
    const waitDuration = 100;
    for (let i = 0; i < waitIterations && receivedFullConfiguration.size !== fullConfiguration.length; ++i) {
      await sleepPromise(waitDuration);
    }

    // Ensure we are no longer subscribed to these topics.
    for (const [topic] of fullConfiguration) {
      await unsubscribe(topic);
    }

    // Check if the published configuration == actual configuration.
    let result = fullConfiguration.length === receivedFullConfiguration.size;

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

    configLog(`Published ${result ? '==' : '!='} current.`);
    return result;
  }

  /**
   * Handles reporting a specific sensor ID to the MQTT broker.
   *
   * @param sensorID - Sensor ID to report
   * @protected
   */
  protected async submitSensorReport(sensorID: string): Promise<void> {
    const submitLog = reportingLog.extend('submitSensorReport');
    try {
      const sensor = this.dataStore.get(sensorID);
      if (!sensor) {
        submitLog('Finished reporting for sensor ID %s, stopping the job', sensorID);
        this.jobStore.get(sensorID)?.stop();
      } else {

        submitLog('Publishing state data for %s', sensorID);
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
      const taskFunc = (): Promise<void> => (this.submitSensorReport(sensorID));

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