/* eslint-disable @typescript-eslint/no-magic-numbers */
import { SensorValue } from './sensorValues';
import { IAcuriteData } from '../../acuparse/acurite.types';
import { DeviceClass_Sensor, IMQTTSensor, IStatePayload } from '../../@types/homeassistant';

/**
 * Implements a sensor value for a humidity sensor.
 */
export class SensorValueSignal extends SensorValue {
  /**
   * constructor
   *
   * @param acuriteData - Acurite data
   */
  public constructor(private readonly acuriteData: IAcuriteData) {
    super();
  }

  /**
   * @inheritDoc
   */
  public override getConfigurationTopicName(): string {
    return this.getUniqueID();
  }

  /**
   * @inheritDoc
   */
  public override populateConfiguration(baseConfig: IMQTTSensor): void {
    baseConfig.device_class = DeviceClass_Sensor.signal_strength;
    baseConfig.name = 'Signal';

    if (!baseConfig.device) {
      baseConfig.device = {};
    }
    baseConfig.device.model = this.acuriteData.mt;
  }

  /**
   * @inheritDoc
   */
  public override getSensorStateName(): string {
    return 'rssi';
  }

  /**
   * @inheritDoc
   */
  public override populateSensorState(inState: IStatePayload): void {
    /*  We need to convert a 1-4 signal strength to Db
     *  Consider the following equivalencies:
     *  1 = 25%
     *  2 = 50%
     *  3 = 75%
     *  4 = 100%
     *
     * Therefore, we are going to convert this to Db
     * 1 = -80
     * 2 = -75
     * 3 = -63
     * 4 = -50
     */

    let stateValue = -50; // assume 4
    if (this.acuriteData.rssi === 3) {
      stateValue = -63;
    } else if (this.acuriteData.rssi === 2) {
      stateValue = -75;
    }  else if (this.acuriteData.rssi === 1) {
      stateValue = -80;
    }

    inState[this.getSensorStateName()] = stateValue;
  }

  /**
   * @inheritDoc
   */
  public override getUniqueID(): string {
    return `${this.acuriteData.sensor}_Signal`;
  }
}