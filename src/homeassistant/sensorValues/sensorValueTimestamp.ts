import { SensorValue } from './sensorValues';
import { IAcuriteData } from '../../acuparse/acurite.types';
import { DeviceClass_Sensor, IMQTTSensor, IStatePayload } from '../../@types/homeassistant';

/**
 * Implements a sensor value for a humidity sensor.
 */
export class SensorValueTimestamp extends SensorValue {
  //todo: Consider adding this as an 'attribute' to each sensor value.
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
    baseConfig.device_class = DeviceClass_Sensor.timestamp;
    baseConfig.name = 'Timestamp';

    if (!baseConfig.device) {
      baseConfig.device = {};
    }
    baseConfig.device.model = this.acuriteData.mt;
  }

  /**
   * @inheritDoc
   */
  public override getSensorStateName(): string {
    return 'timestamp';
  }

  /**
   * @inheritDoc
   */
  public override populateSensorState(inState: IStatePayload): void {
    inState[this.getSensorStateName()] = this.acuriteData.dateutc;
  }

  /**
   * @inheritDoc
   */
  public override getUniqueID(): string {
    return `${this.acuriteData.sensor}_${this.acuriteData.mt}_ts`;
  }
}