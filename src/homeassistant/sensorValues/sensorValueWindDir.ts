import { IAcurite5in1x31 } from '../../acuparse/acurite.types';
import { IMQTTSensor, ISensorState, SensorType } from '../../@types/homeassistant';
import { SensorValue } from './sensorValues';

/**
 * Implements a sensor value for a temperature sensor.
 */
export class SensorValueWindDir extends SensorValue {
  /**
   * constructor
   *
   * @param towerData - Tower data
   */
  public constructor(private readonly towerData: IAcurite5in1x31) {
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
  public override getSensorName(): string {
    return 'Wind Direction';
  }

  /**
   * @inheritDoc
   */
  public override populateConfiguration(baseConfig: IMQTTSensor): void {
    baseConfig.unit_of_measurement = 'deg';

    if (!baseConfig.device) {
      baseConfig.device = {};
    }
    baseConfig.device.model = this.towerData.mt;
  }

  /**
   * @inheritDoc
   */
  public override getSensorStateName(): string {
    return 'winddir';
  }

  /**
   * @inheritDoc
   */
  public override populateSensorData(inState: ISensorState): void {
    if (inState.sensorType === SensorType.sensor) {
      inState.payload[this.getSensorStateName()] = this.towerData.winddir;
    }
  }

  /**
   * @inheritDoc
   */
  public override getUniqueID(): string {
    return `${this.towerData.sensor}_WindDir`;
  }
}