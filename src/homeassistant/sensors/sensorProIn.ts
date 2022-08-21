import { IAcuriteProInData } from '../../acuparse/acurite.types';
import { SensorTower } from './sensorTower';
import { SensorValueWater } from '../sensorValues/sensorValueWater';

/**
 * A Home Assistant sensor definition for an Acurite 'tower' sensor.
 */
export class SensorProIn extends SensorTower {
  /**
   * Constructor.
   *
   * @param towerData - Acurite // Acuparse tower data.
   */
  public constructor(towerData: IAcuriteProInData) {
    super(towerData);

    this.addSensorValue(new SensorValueWater(towerData));
  }

  /**
   * @inheritDoc
   */
  public override getSensorID(): string {
    return `${this.towerData.sensor}_${this.towerData.mt}`;
  }
}