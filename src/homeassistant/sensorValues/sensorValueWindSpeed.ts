import { IAcuriteDataWithWind } from '../../acuparse/acurite.types';
import { IMQTTSensor, ISensorState, SensorType } from '../../@types/homeassistant';
import { SensorValue } from './sensorValues';

/**
 * Implements a sensor value for a temperature sensor.
 */
export class SensorValueWindSpeed extends SensorValue {
  /**
   * constructor
   *
   * @param towerData - Tower data
   */
  public constructor(private readonly towerData: IAcuriteDataWithWind) {
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
    return 'Wind Speed';
  }

  /**
   * @inheritDoc
   */
  public override populateConfiguration(baseConfig: IMQTTSensor): void {
    baseConfig.unit_of_measurement = 'mph';

    if (!baseConfig.device) {
      baseConfig.device = {};
    }
    baseConfig.device.model = this.towerData.mt;
  }

  /**
   * @inheritDoc
   */
  public override getSensorStateName(): string {
    return 'windmph';
  }

  /**
   * @inheritDoc
   */
  public override populateSensorData(inState: ISensorState): void {
    if (inState.sensorType === SensorType.sensor) {
      inState.payload[this.getSensorStateName()] = this.towerData.windspeedmph;
    }
  }

  /**
   * @inheritDoc
   */
  public override getUniqueID(): string {
    return `${this.towerData.sensor}_${this.towerData.mt}_Wind`;
  }
}