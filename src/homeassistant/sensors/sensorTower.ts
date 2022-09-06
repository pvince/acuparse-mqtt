import { IAcuriteDataWithTemperature } from '../../acuparse/acurite.types';
import { ISensorConfig } from './sensors';
import { SensorValueTemperature } from '../sensorValues/sensorValueTemperature';
import { SensorValueHumidity } from '../sensorValues/sensorValueHumidity';
import { SensorAcurite } from './sensorAcurite';

/**
 * A Home Assistant sensor definition for an Acurite 'tower' sensor.
 */
export class SensorTower extends SensorAcurite {
  /**
   * Constructor.
   *
   * @param towerData - Acurite // Acuparse tower data.
   * @param config - Sensor configuration information.
   */
  public constructor(towerData: IAcuriteDataWithTemperature, config: ISensorConfig) {
    super(towerData, config);

    this.addSensorValue(new SensorValueTemperature(towerData));
    this.addSensorValue(new SensorValueHumidity(towerData));
    // Disabling timestamp for now
    // this.addSensorValue(new SensorValueTimestamp(this.towerData));
  }
}