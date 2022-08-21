import { IAcurite5in1x38Data } from '../../acuparse/acurite.types';
import { SensorTower } from './sensorTower';
import { SensorValueWindSpeed } from '../sensorValues/sensorValueWindSpeed';

/**
 * A Home Assistant sensor definition for an Acurite 'tower' sensor.
 */
export class Sensor5n1x38 extends SensorTower {
  /**
   * Constructor.
   *
   * @param towerData - Acurite // Acuparse tower data.
   */
  public constructor(towerData: IAcurite5in1x38Data) {
    super(towerData);

    this.addSensorValue(new SensorValueWindSpeed(towerData));
  }

  /**
   * @inheritDoc
   */
  public override getSensorID(): string {
    return `${this.towerData.sensor}_${this.towerData.mt}`;
  }
}