import { IMQTTSensor, IStatePayload, SensorType } from '../../@types/homeassistant';

/**
 * Basic sensor class definition.
 */
export abstract class SensorValue {
  /**
   * The type of Home Assistant sensor this value is for. Default is the generic {@link SensorType.sensor}
   *
   * @returns - This value's Home Assistant sensor type
   */
  public getSensorType(): SensorType {
    return SensorType.sensor;
  }

  /**
   * Example of a full configuration topic name:
   *  homeassistant/sensor/sensorBedroomT/config
   *
   * @example sensorBedroomT
   * @returns - Configuration topic name for this specific sensor value.
   */
  public abstract getConfigurationTopicName(): string;

  /**
   * Returns a basic initialized configuration. A basic initialized configuration
   * will be passed in to be populated.
   */
  public abstract populateConfiguration(baseConfig: IMQTTSensor): void;

  /**
   * When populating the final 'state value' payload, what should this state name be?
   *
   * @example temperature
   * @returns - Return the sensors state name.
   */
  public abstract getSensorStateName(): string;

  /**
   * Takes our local sensor state name & value and add them to the provided state payload.
   *
   * @param inState - State payload to populate
   */
  public abstract populateSensorState(inState: IStatePayload): void;

  /**
   * @example 00002348_Temperature
   * @returns - Returns the 'unique_id' to use for this sensor value type definition.
   */
  public abstract getUniqueID(): string;

}