import { IAcurite5in1x31Data, IAcurite5in1x38Data } from '../../acuparse/acurite.types';
import { SensorTower } from './sensorTower';
import { SensorValueWindSpeed } from '../sensorValues/sensorValueWindSpeed';
import { MultiValueSensor } from './sensors';
import { SensorValueTimestamp } from '../sensorValues/sensorValueTimestamp';
import { SensorValueWindDir } from '../sensorValues/sensorValueWindDir';
import { SensorValueRainCur } from '../sensorValues/sensorValueRainCur';
import { SensorValueRainDaily } from '../sensorValues/sensorValueRainDaily';

/**
 * A Home Assistant sensor definition for an Acurite '5m1x38' sensor.
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

/**
 * A home assistant sensor definition for an acurite 5n1x31 sensor
 */
export class Sensor5n1x31 extends MultiValueSensor {
  /**
   * Constructor.
   *
   * @param towerData - Acurite // Acuparse tower data.
   */
  public constructor(protected readonly towerData: IAcurite5in1x31Data) {
    super();

    this.addSensorValue(new SensorValueWindSpeed(this.towerData));
    this.addSensorValue(new SensorValueWindDir(this.towerData));
    this.addSensorValue(new SensorValueRainCur(this.towerData));
    this.addSensorValue(new SensorValueRainDaily(this.towerData));
    this.addSensorValue(new SensorValueTimestamp(this.towerData));
  }

  /**
   * @inheritDoc
   */
  public override getSensorID(): string {
    return `${this.towerData.sensor}_${this.towerData.mt}`;
  }
}