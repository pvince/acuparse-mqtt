import { SensorValue } from '../sensorValues/sensorValues';
import { IMQTTSensor, IStatePayload } from '../../@types/homeassistant';

const TOPIC_PREFIX = 'homeassistant';
const getSensorTopicRoot = (sensorID: string, sensorValue: SensorValue): string => (`${TOPIC_PREFIX}/${sensorValue.getSensorType()}/${sensorID}`);
const getSensorTopicConfig = (sensorID: string, sensorValue:  SensorValue): string => (`${getSensorTopicRoot(sensorID, sensorValue)}/${sensorValue.getConfigurationTopicName()}/config`);
const getSensorTopicState = (sensorID: string, sensorValue: SensorValue): string => (`${getSensorTopicRoot(sensorID, sensorValue)}/state`);

/**
 * A sensor that has multiple values.
 */
export abstract class MultiValueSensor {
  protected readonly sensorValues = new Map<string, SensorValue>;

  /**
   * Adds a new sensor value definition to this class.
   *
   * @param inSensorValue -  Sensor value to add.
   */
  public addSensorValue(inSensorValue: SensorValue): void {
    this.sensorValues.set(inSensorValue.getUniqueID(), inSensorValue);
  }

  /**
   * Constructs the Home Assistant MQTT configuration data for the sensor values.
   *
   * @returns - An array of [mqttTopic, mqttSensorConfig] values.
   */
  public getConfiguration(): [string, IMQTTSensor][] {
    const result: [string, IMQTTSensor][] = [];

    for (const sensorValue of this.sensorValues.values()) {
      // Build the MQTT topic paths
      const configTopic = getSensorTopicConfig(this.getSensorID(), sensorValue);
      const stateTopic = getSensorTopicState(this.getSensorID(), sensorValue);

      // Build the basic MQTT Sensor & populate it.
      const mqttSensor:  IMQTTSensor = {
        state_topic: stateTopic,
        value_template: `{{ value_json.${sensorValue.getSensorStateName()} }}`,
        device: {
          manufacturer: 'Acurite',
          via_device: 'acuparse-mqtt',
          identifiers: [ this.getSensorID() ],
          name: this.getSensorID()
        },
        unique_id: sensorValue.getUniqueID()
      };
      sensorValue.populateConfiguration(mqttSensor);

      result.push([configTopic, mqttSensor]);
    }

    return result;
  }

  /**
   * Constructs the Home Assistant MQTT sensor state data for the sensor values.
   *
   * @returns - Both the MQTT state topic & the state payload
   */
  public getState(): Map<string, IStatePayload> {
    const result = new Map<string, IStatePayload>();

    for (const sensorValue of this.sensorValues.values()) {
      const stateTopic = getSensorTopicState(this.getSensorID(), sensorValue);

      let statePayload = result.get(stateTopic);
      if (!statePayload) {
        statePayload = {};
        result.set(stateTopic, statePayload);
      }

      sensorValue.populateSensorState(statePayload);
    }

    return result;
  }

  /**
   * Unique sensor identifier. This is just used for grouping the data in the MQTT broker.
   */
  public abstract getSensorID(): string;
}