import { IAcuriteDataWithTemperature } from '../../acuparse/acurite.types';
import { ISensorConfig, MultiValueSensor } from './sensors';
import { SensorValueTemperature } from '../sensorValues/sensorValueTemperature';
import { SensorValueHumidity } from '../sensorValues/sensorValueHumidity';
import { SensorValueBattery } from '../sensorValues/sensorValueBattery';
import { SensorValueSignal } from '../sensorValues/sensorValueSignal';

/**
 * A Home Assistant sensor definition for an Acurite 'tower' sensor.
 */
export class SensorTower extends MultiValueSensor {
  /**
   * Constructor.
   *
   * @param towerData - Acurite // Acuparse tower data.
   * @param config - Sensor configuration information.
   */
  public constructor(protected readonly towerData: IAcuriteDataWithTemperature, config: ISensorConfig) {
    super(config);

    this.addSensorValue(new SensorValueTemperature(this.towerData));
    this.addSensorValue(new SensorValueHumidity(this.towerData));
    this.addSensorValue(new SensorValueBattery(this.towerData));
    this.addSensorValue(new SensorValueSignal(this.towerData));
    // Disabling timestamp for now
    // this.addSensorValue(new SensorValueTimestamp(this.towerData));
  }

  /**
   * @inheritDoc
   */
  public override getSensorID(): string {
    return `${this.towerData.sensor}_${this.towerData.mt}`;
  }
}