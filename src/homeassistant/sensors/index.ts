import { IAcuriteData } from '../../acuparse/acurite.types';
import { ISensorConfig, MultiValueSensor } from './sensors';
import { IAcuriteTowerType } from '../../@types/acurite';
import { SensorTower } from './sensorTower';
import { SensorProIn } from './sensorProIn';
import { Sensor5n1x31, Sensor5n1x38 } from './sensor5n1';
import { getAcuparse } from '../../acuparse/acuparseClient';
import { decode } from 'html-entities';

/**
 * Determines what name a sensor (aka device) should be given.
 *
 * @param acuriteData - Acurite data
 * @returns - The devices name
 */
export async function getSensorName(acuriteData: IAcuriteData): Promise<string> {
  let sensorName: string;
  switch (acuriteData.mt) {
    case IAcuriteTowerType.FiveInOneX31:
      sensorName = 'Weather - Wind & Rain';
      break;
    case IAcuriteTowerType.FiveInOneX38:
      sensorName = 'Weather - Temperature';
      break;
    case IAcuriteTowerType.tower:
    case IAcuriteTowerType.ProIn: {
      const acuparseTower = await getAcuparse()?.getTower(acuriteData.sensor);
      sensorName = acuparseTower?.name ?? `${acuriteData.mt} ${acuriteData.sensor}`;
      break;
    }
  }

  return decode(sensorName);
}

/**
 * Initializes the appropriate sensor from acurite // acuparse data.
 *
 * @param acuriteData - Acurite // Acuparse sensor data.
 * @returns - Appropriately initialized sensor.
 */
export async function createSensor(acuriteData: IAcuriteData): Promise<MultiValueSensor> {
  let sensor: MultiValueSensor;

  const config: ISensorConfig = {
    sensorName: await getSensorName(acuriteData)
  };

  switch (acuriteData.mt) {
    case IAcuriteTowerType.tower:
      sensor = new SensorTower(acuriteData, config);
      break;
    case IAcuriteTowerType.ProIn:
      sensor = new SensorProIn(acuriteData, config);
      break;
    case IAcuriteTowerType.FiveInOneX31:
      sensor = new Sensor5n1x31(acuriteData, config);
      break;
    case IAcuriteTowerType.FiveInOneX38:
      sensor = new Sensor5n1x38(acuriteData, config);
      break;
  }

  return sensor;
}