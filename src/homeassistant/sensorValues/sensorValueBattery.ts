import { SensorValue } from './sensorValues';
import { IAcuriteData } from '../../acuparse/acurite.types';
import { DeviceClass_Sensor, IMQTTSensor, IStatePayload } from '../../@types/homeassistant';

/**
 * Implements a sensor value for a humidity sensor.
 */
export class SensorValueBattery extends SensorValue {
  /**
   * constructor
   *
   * @param acuriteData - Acurite data
   */
  public constructor(private readonly acuriteData: IAcuriteData) {
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
    baseConfig.device_class = DeviceClass_Sensor.battery;
    baseConfig.device = {
      model: this.acuriteData.mt,
      manufacturer: 'Acurite',
      via_device: 'acuparse-mqtt'
    };
    baseConfig.unique_id = this.getUniqueID();
  }

  /**
   * @inheritDoc
   */
  public override getSensorStateName(): string {
    return 'battery';
  }

  /**
   * @inheritDoc
   */
  public override populateSensorState(inState: IStatePayload): void {
    inState[this.getSensorStateName()] = this.acuriteData.battery;
  }

  /**
   * @inheritDoc
   */
  public override getUniqueID(): string {
    return `${this.acuriteData.sensor}_Batt`;
  }
}