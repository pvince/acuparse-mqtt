import { IAcurite5in1x38Data } from '../../acuparse/acurite.types';
import { IMQTTSensor, IStatePayload } from '../../@types/homeassistant';
import { SensorValue } from './sensorValues';

/**
 * Implements a sensor value for a temperature sensor.
 */
export class SensorValueWindSpeed extends SensorValue {
  /**
   * constructor
   *
   * @param towerData - Tower data
   */
  public constructor(private readonly towerData: IAcurite5in1x38Data) {
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
    // TODO_PTV: Determine if there is a relevant dataclass?
    //baseConfig.device_class = DeviceClass_Sensor.temperature;
    baseConfig.device = {
      model: this.towerData.mt,
      manufacturer: 'Acurite',
      via_device: 'acuparse-mqtt'
    };
    baseConfig.unique_id = this.getUniqueID();
    baseConfig.unit_of_measurement = 'mph';
  }

  /**
   * @inheritDoc
   */
  public override getSensorStateName(): string {
    return 'windmph';
  }

  /**
   * @inheritDoc
   */
  public override populateSensorState(inState: IStatePayload): void {
    inState[this.getSensorStateName()] = this.towerData.windspeedmph;
  }

  /**
   * @inheritDoc
   */
  public override getUniqueID(): string {
    return `${this.towerData.sensor}_Wind`;
  }
}