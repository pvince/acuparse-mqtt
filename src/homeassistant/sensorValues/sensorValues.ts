import { BinarySensorState, IMQTTSensor, ISensorState, SensorType } from '../../@types/homeassistant';

/**
 * Initializes a sensor state variable based on the sensorValue's type.
 *
 * @param sensorValue - Sensor value to find the type for
 * @returns - Returns a newly initialized sensor state object.
 * @throws {Error} Throws an error if we don't know how to handle the sensorValue's type yet.
 */
export function initializeSensorState(sensorValue: SensorValue): ISensorState {
  let result: ISensorState;

  switch (sensorValue.getSensorType()) {
    case SensorType.sensor:
      result = {
        sensorType: SensorType.sensor,
        payload: {}
      };
      break;
    case SensorType.binary_sensor:
      result = {
        sensorType: SensorType.binary_sensor,
        payload: BinarySensorState.off
      };
    case SensorType.cover:
    case SensorType.media_player:
    case SensorType.switch:
      throw new Error(`Sensor type [${sensorValue.getSensorType()}] not supported yet.`);
  }

  return result;
}

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
   * Takes our local sensor state name & value and add them to the provided state payload.
   *
   * @param inState - State payload to populate
   * @throws {Error} - Throws an error if the input state's sensor type does not match this sensor value type.
   */
  public populateSensorState(inState: ISensorState): void {
    if (inState.sensorType !== this.getSensorType()) {
      throw new Error(`Sensor type mismatch for ${this.getConfigurationTopicName()} (${inState.sensorType} !== ${this.getSensorType()})`);
    }
    this.populateSensorData(inState);
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
   * @example 00002348_Temperature
   * @returns - Returns the 'unique_id' to use for this sensor value type definition.
   */
  public abstract getUniqueID(): string;

  /**
   * Returns the sensor value's name.
   *
   * @returns - Returns the sensor value's friendly name
   */
  public abstract getSensorName(): string;

  /**
   * Takes our local sensor state name & value and add them to the provided state payload.
   *
   * @param inState - State payload to populate
   * @protected
   */
  protected abstract populateSensorData(inState: ISensorState): void;
}