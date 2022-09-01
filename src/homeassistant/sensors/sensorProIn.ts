import { IAcuriteProIn } from '../../acuparse/acurite.types';
import { SensorTower } from './sensorTower';
import { SensorValueWater } from '../sensorValues/sensorValueWater';
import { ISensorConfig } from './sensors';

/**
 * A Home Assistant sensor definition for an Acurite 'tower' sensor.
 */
export class SensorProIn extends SensorTower {
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

  /**
   * @inheritDoc
   */
  public override getSensorID(): string {
    return `${this.towerData.sensor}_${this.towerData.mt}`;
  }
}