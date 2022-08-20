import { IAcuriteDataWithTemperature } from '../../acuparse/acurite.types';
import { MultiValueSensor } from './sensors';
import { SensorValueTemperature } from '../sensorValues/sensorValueTemperature';
import { SensorValueHumidity } from '../sensorValues/sensorValueHumidity';
import { SensorValueBattery } from '../sensorValues/sensorValueBattery';
import { SensorValueSignal } from '../sensorValues/sensorValueSignal';
import { SensorValueTimestamp } from '../sensorValues/sensorValueTimestamp';

/**
 * A Home Assistant sensor definition for an Acurite 'tower' sensor.
 */
export class SensorTower extends MultiValueSensor {
  /**
   * Constructor.
   *
   * @param towerData - Acurite // Acuparse tower data.
   */
  public constructor(protected readonly towerData: IAcuriteDataWithTemperature) {
    super();

    this.addSensorValue(new SensorValueTemperature(this.towerData));
    this.addSensorValue(new SensorValueHumidity(this.towerData));
    this.addSensorValue(new SensorValueBattery(this.towerData));
    this.addSensorValue(new SensorValueSignal(this.towerData));
    this.addSensorValue(new SensorValueTimestamp(this.towerData));
  }

  /**
   * @inheritDoc
   */
  public override getSensorID(): string {
    return `${this.towerData.sensor}_${this.towerData.mt}`;
  }
}