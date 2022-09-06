import { IAcurite5in1x31, IAcurite5in1x38 } from '../../acuparse/acurite.types';
import { SensorTower } from './sensorTower';
import { SensorValueWindSpeed } from '../sensorValues/sensorValueWindSpeed';
import { ISensorConfig } from './sensors';
import { SensorValueWindDir } from '../sensorValues/sensorValueWindDir';
import { SensorValueRainCur } from '../sensorValues/sensorValueRainCur';
import { SensorValueRainDaily } from '../sensorValues/sensorValueRainDaily';
import { SensorAcurite } from './sensorAcurite';

/**
 * A Home Assistant sensor definition for an Acurite '5m1x38' sensor.
 */
export class Sensor5n1x38 extends SensorTower {
  /**
   * Constructor.
   *
   * @param towerData - Acurite // Acuparse tower data.
   * @param config - Sensor configuration information.
   */
  public constructor(towerData: IAcurite5in1x38, config: ISensorConfig) {
    super(towerData, config);

    this.addSensorValue(new SensorValueWindSpeed(towerData));
  }
}

/**
 * A home assistant sensor definition for an acurite 5n1x31 sensor
 */
export class Sensor5n1x31 extends SensorAcurite {
  /**
   * Constructor.
   *
   * @param towerData - Acurite // Acuparse tower data.
   * @param config - Sensor configuration information.
   */
  public constructor(towerData: IAcurite5in1x31, config: ISensorConfig) {
    super(towerData, config);

    this.addSensorValue(new SensorValueWindSpeed(towerData));
    this.addSensorValue(new SensorValueWindDir(towerData));
    this.addSensorValue(new SensorValueRainCur(towerData));
    this.addSensorValue(new SensorValueRainDaily(towerData));
    // Disabling timestamp for now.
    //this.addSensorValue(new SensorValueTimestamp(this.towerData));
  }
}