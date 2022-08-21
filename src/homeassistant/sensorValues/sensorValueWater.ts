import { IAcuriteProInData } from '../../acuparse/acurite.types';
import {
  BinarySensorState,
  DeviceClass_BinarySensor,
  IMQTTSensor,
  ISensorState,
  SensorType
} from '../../@types/homeassistant';
import { SensorValue } from './sensorValues';

/**
 * Implements a sensor value for a temperature sensor.
 */
export class SensorValueWater extends SensorValue {
  /**
   * constructor
   *
   * @param towerData - Tower data
   */
  public constructor(private readonly towerData: IAcuriteProInData) {
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
    return 'Water';
  }

  /**
   * @inheritDoc
   */
  public override populateConfiguration(baseConfig: IMQTTSensor): void {
    baseConfig.device_class = DeviceClass_BinarySensor.moisture;

    if (!baseConfig.device) {
      baseConfig.device = {};
    }
    baseConfig.device.model = this.towerData.mt;
  }

  /**
   * @inheritDoc
   */
  public override getSensorStateName(): string {
    return 'water';
  }

  /**
   * @inheritDoc
   */
  public override populateSensorData(inState: ISensorState): void {
    if (inState.sensorType === SensorType.binary_sensor) {
      inState.payload = this.towerData.water ? BinarySensorState.on : BinarySensorState.off;
    }
  }

  /**
   * @inheritDoc
   */
  public override getUniqueID(): string {
    return `${this.towerData.sensor}_Water`;
  }

  /**
   * @inheritDoc
   */
  public override getSensorType(): SensorType {
    return SensorType.binary_sensor;
  }
}