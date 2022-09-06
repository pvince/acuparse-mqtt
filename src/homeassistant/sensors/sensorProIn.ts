import { IAcuriteProIn } from '../../acuparse/acurite.types';
import { SensorValueWater } from '../sensorValues/sensorValueWater';
import { ISensorConfig } from './sensors';
import { SensorAcurite } from './sensorAcurite';

/**
 * A Home Assistant sensor definition for an Acurite 'tower' sensor.
 */
export class SensorProIn extends SensorAcurite {
  /**
   * Constructor.
   *
   * @param towerData - Acurite // Acuparse tower data.
   * @param config - Sensor configuration information.
   */
  public constructor(towerData: IAcuriteProIn, config: ISensorConfig) {
    super(towerData, config);

    this.addSensorValue(new SensorValueWater(towerData));
  }
}