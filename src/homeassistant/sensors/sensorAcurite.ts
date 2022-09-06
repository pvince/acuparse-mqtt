import { ISensorConfig, ISerializationObject, MultiValueSensor } from './sensors';
import { IAcuriteData } from '../../acuparse/acurite.types';
import { SensorValueBattery } from '../sensorValues/sensorValueBattery';
import { SensorValueSignal } from '../sensorValues/sensorValueSignal';

/**
 * Abstract base class that implements the common functionality for all acurite based devices.
 */
export abstract class SensorAcurite extends MultiValueSensor {

  /**
   * Constructor
   *
   * @param acuriteData - Acurite // Acuparse tower data
   * @param config - Sensor configuration information
   */
  protected constructor(protected readonly acuriteData: IAcuriteData, config: ISensorConfig) {
    super(config);

    this.addSensorValue(new SensorValueBattery(acuriteData));
    this.addSensorValue(new SensorValueSignal(acuriteData));
  }

  /**
   * @inheritDoc
   */
  public override getSensorID(): string {
    return `${this.acuriteData.sensor}_${this.acuriteData.mt}`;
  }

  /**
   * @inheritDoc
   */
  public override getShortSensorID(): string {
    return this.acuriteData.sensor;
  }

  /**
   * @inheritDoc
   */
  protected override populateSerializationObject(inDestObj: ISerializationObject): void {
    inDestObj.acuriteData = this.acuriteData;
  }
}