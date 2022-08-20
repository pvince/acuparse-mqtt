import { IAcuriteDataWithTemperature } from '../../acuparse/acurite.types';
import { DeviceClass_Sensor, IMQTTSensor, IStatePayload } from '../../@types/homeassistant';
import { SensorValue } from './sensorValues';

/**
 * Implements a sensor value for a temperature sensor.
 */
export class SensorValueTemperature extends SensorValue {
  /**
   * constructor
   *
   * @param towerData - Tower data
   */
  public constructor(private readonly towerData: IAcuriteDataWithTemperature) {
    super();
  }

  /**
   * @inheritDoc
   */
  public override getConfigurationTopicName(): string {
    return this.getUniqueID();
  }

  /**
   * @inheritDoc
   */
  public override populateConfiguration(baseConfig: IMQTTSensor): void {
    baseConfig.device_class = DeviceClass_Sensor.temperature;
    baseConfig.device = {
      model: this.towerData.mt,
      manufacturer: 'Acurite',
      via_device: 'acuparse-mqtt'
    };
    baseConfig.unique_id = this.getUniqueID();
    baseConfig.unit_of_measurement = 'F';
  }

  /**
   * @inheritDoc
   */
  public override getSensorStateName(): string {
    return 'tempf';
  }

  /**
   * @inheritDoc
   */
  public override populateSensorState(inState: IStatePayload): void {
    inState[this.getSensorStateName()] = this.towerData.tempf;
  }

  /**
   * @inheritDoc
   */
  public override getUniqueID(): string {
    return `${this.towerData.sensor}_Temp`;
  }
}