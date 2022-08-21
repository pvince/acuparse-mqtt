import { IAcuriteData } from '../../acuparse/acurite.types';
import { MultiValueSensor } from './sensors';
import { IAcuriteTowerType } from '../../@types/acurite';
import { SensorTower } from './sensorTower';
import { SensorProIn } from './sensorProIn';
import { Sensor5n1x31, Sensor5n1x38 } from './sensor5n1';

/**
 * Initializes the appropriate sensor from acurite // acuparse data.
 *
 * @param acuriteData - Acurite // Acuparse sensor data.
 * @returns - Appropriately initialized sensor.
 */
export function createSensor(acuriteData: IAcuriteData): MultiValueSensor {
  let sensor: MultiValueSensor;

  switch (acuriteData.mt) {
    case IAcuriteTowerType.tower:
      sensor = new SensorTower(acuriteData);
      break;
    case IAcuriteTowerType.ProIn:
      sensor = new SensorProIn(acuriteData);
      break;
    case IAcuriteTowerType.FiveInOneX31:
      sensor = new Sensor5n1x31(acuriteData);
      break;
    case IAcuriteTowerType.FiveInOneX38:
      sensor = new Sensor5n1x38(acuriteData);
      break;
  }

  return sensor;
}