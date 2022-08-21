import { IAcurite5in1x31Data } from '../../acuparse/acurite.types';
import { IMQTTSensor, IStatePayload, StateClass } from '../../@types/homeassistant';
import { SensorValue } from './sensorValues';

/**
 * Implements a sensor value for a temperature sensor.
 */
export class SensorValueRainDaily extends SensorValue {
  /**
   * constructor
   *
   * @param towerData - Tower data
   */
  public constructor(private readonly towerData: IAcurite5in1x31Data) {
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
    // TODO: Determine if there is a relevant dataclass?
    //baseConfig.device_class = DeviceClass_Sensor.temperature;
    baseConfig.state_class = StateClass.total;
    baseConfig.unit_of_measurement = 'in';
    baseConfig.name = 'Rain Today';

    if (!baseConfig.device) {
      baseConfig.device = {};
    }
    baseConfig.device.model = this.towerData.mt;
  }

  /**
   * @inheritDoc
   */
  public override getSensorStateName(): string {
    return 'daily_rain';
  }

  /**
   * @inheritDoc
   */
  public override populateSensorState(inState: IStatePayload): void {
    inState[this.getSensorStateName()] = this.towerData.dailyrainin;
  }

  /**
   * @inheritDoc
   */
  public override getUniqueID(): string {
    return `${this.towerData.sensor}_RainDaily`;
  }
}