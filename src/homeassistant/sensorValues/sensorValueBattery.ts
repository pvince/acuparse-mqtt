import { SensorValue } from './sensorValues';
import { IAcuriteData } from '../../acuparse/acurite.types';
import { DeviceClass_Sensor, IMQTTSensor, ISensorState, SensorType } from '../../@types/homeassistant';
import { IAcuriteBatteryLevel } from '../../@types/acurite/acurite';

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
  public override getSensorName(): string {
    return 'Battery';
  }

  /**
   * @inheritDoc
   */
  public override populateConfiguration(baseConfig: IMQTTSensor): void {
    baseConfig.device_class = DeviceClass_Sensor.battery;
    if (!baseConfig.device) {
      baseConfig.device = {};
    }
    baseConfig.device.model = this.acuriteData.mt;
    baseConfig.unit_of_measurement = '%';
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
  public override populateSensorData(inState: ISensorState): void {
    if (inState.sensorType === SensorType.sensor) {
      let batteryLevel: number;

      const batteryNormal = 100;
      const batteryLow = 10;

      switch (this.acuriteData.battery) {
        case IAcuriteBatteryLevel.normal:
          batteryLevel = batteryNormal;
          break;
        case IAcuriteBatteryLevel.low:
          batteryLevel = batteryLow;
          break;
      }

      inState.payload[this.getSensorStateName()] = batteryLevel;
    }
  }

  /**
   * @inheritDoc
   */
  public override getUniqueID(): string {
    return `${this.acuriteData.sensor}_${this.acuriteData.mt}_Batt`;
  }
}