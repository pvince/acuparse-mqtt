import { SensorValue } from './sensorValues';
import { IAcuriteDataWithTemperature } from '../../acuparse/acurite.types';
import { DeviceClass_Sensor, IMQTTSensor, ISensorState, SensorType } from '../../@types/homeassistant';

/**
 * Implements a sensor value for a humidity sensor.
 */
export class SensorValueHumidity extends SensorValue {
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
  public override getSensorName(): string {
    return 'Humidity';
  }

  /**
   * @inheritDoc
   */
  public override populateConfiguration(baseConfig: IMQTTSensor): void {
    baseConfig.device_class = DeviceClass_Sensor.humidity;
    baseConfig.unit_of_measurement = '%';

    if (!baseConfig.device) {
      baseConfig.device = {};
    }
    baseConfig.device.model = this.towerData.mt;
  }

  /**
   * @inheritDoc
   */
  public override getSensorStateName(): string {
    return 'humidity';
  }

  /**
   * @inheritDoc
   */
  public override populateSensorData(inState: ISensorState): void {
    if (inState.sensorType === SensorType.sensor) {
      inState.payload[this.getSensorStateName()] = this.towerData.humidity;
    }
  }

  /**
   * @inheritDoc
   */
  public override getUniqueID(): string {
    return `${this.towerData.sensor}_Humidity`;
  }
}