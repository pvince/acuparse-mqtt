import { IAccessTowerQuery, IAcuriteAccessRawQueryData } from '../@types/acurite/access';
import { IAcuriteData, IAcuriteTower } from './acurite.types';
import { IAcuriteTowerType } from '../@types/acurite/acurite';

/**
 * Translates an Access tower query data to a standard Acurite tower object.
 *
 * @param accessTower - Access tower data from a query
 * @returns - Standardized tower object
 */
function translateTower(accessTower: IAccessTowerQuery): IAcuriteTower {
  return {
    id: accessTower.id,
    sensor: accessTower.sensor,
    baromin: Number(accessTower.baromin),
    battery: accessTower.sensorbattery,
    rssi:  Number(accessTower.rssi),
    dateutc: accessTower.dateutc,
    realtime: true,
    mt: IAcuriteTowerType.tower,
    tempf: Number(accessTower.tempf),
    humidity: Number(accessTower.humidity)
  };
}

/**
 * Translate Access query data to standardized acurite data.
 *
 * @param inData - Access query data
 * @returns - Standardized Acurite object
 * @throws - Throws an error if the incoming data cannot be translated
 */
export function translateAccess(inData: IAcuriteAccessRawQueryData): IAcuriteData {
  let resultData: IAcuriteData;
  switch (inData.mt) {
    case IAcuriteTowerType.tower:
      resultData = translateTower(inData);
      break;
    case IAcuriteTowerType.ProIn:
    case IAcuriteTowerType.FiveInOneX31:
    case IAcuriteTowerType.FiveInOneX38:
      throw new Error('Access query data has no type data defined yet.');
  }
  return resultData;
}