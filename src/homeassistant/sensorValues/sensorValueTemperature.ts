import { IAcuriteDataWithTemperature } from '../../acuparse/acurite.types';
import {
  DeviceClass_Sensor,
  IMQTTSensor,
  ISensorState,
  SensorType
} from '../../@types/homeassistant';
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
  public override getSensorName(): string {
    return 'Temperature';
  }

  /**
   * @inheritDoc
   */
  public override populateConfiguration(baseConfig: IMQTTSensor): void {
    baseConfig.device_class = DeviceClass_Sensor.temperature;
    baseConfig.unit_of_measurement = 'F';

    if (!baseConfig.device) {
      baseConfig.device = {};
    }
    baseConfig.device.model = this.towerData.mt;
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
  public override populateSensorData(inState: ISensorState): void {
    if (inState.sensorType === SensorType.sensor) {
      inState.payload[this.getSensorStateName()] = this.towerData.tempf;
    }
  }

  /**
   * @inheritDoc
   */
  public override getUniqueID(): string {
    return `${this.towerData.sensor}_Temp`;
  }
}