import {
  ISmartHub5in1x31Query,
  ISmartHub5in1x38Query,
  ISmartHubProInQuery,
  ISmartHubQueryBase,
  IAcuriteSmartHubRawQueryData,
  ISmartHubTowerQuery
} from '../@types/acurite/smartHub';
import {
  IAcurite5in1x31,
  IAcurite5in1x38,
  IAcuriteBase,
  IAcuriteData,
  IAcuriteProIn,
  IAcuriteTower
} from './acurite.types';
import { IAcuriteBool, IAcuriteDateUTC, IAcuriteTowerType } from '../@types/acurite/acurite';

const _convertBool = (inBool: IAcuriteBool): boolean => inBool === IAcuriteBool.true;

/**
 * Converts common data.
 *
 * @param inData - Data to convert
 * @returns - Returns the parsed data.
 */
export function translateBase(inData: ISmartHubQueryBase): IAcuriteBase {
  let dateToUse: Date;

  switch (inData.dateutc) {
    case IAcuriteDateUTC.now:
      dateToUse = new Date();
      break;
  }

  return {
    id: inData.id,
    sensor: inData.sensor,
    baromin: Number(inData.baromin),
    battery: inData.battery,
    rssi: Number(inData.rssi),
    dateutc: dateToUse,
    realtime: _convertBool(inData.realtime)
  };
}

/**
 * Parses string data in the query data.
 *
 * @param inData - Data to convert
 * @returns - Parsed data
 */
export function translateTower(inData: ISmartHubTowerQuery): IAcuriteTower {
  const baseData = translateBase(inData);

  return {
    ...baseData,
    mt: inData.mt,
    tempf: Number(inData.tempf),
    humidity: Number(inData.humidity)
  };
}

/**
 * Parses string data in the query data.
 *
 * @param inData - Data to convert
 * @returns - Parsed data
 */
export function translateProIn(inData: ISmartHubProInQuery): IAcuriteProIn {
  const baseData = translateBase(inData);

  return {
    ...baseData,
    mt: inData.mt,
    tempf: Number(inData.indoortempf),
    humidity: Number(inData.indoorhumidity),
    probe: inData.probe,
    check: _convertBool(inData.check),
    water: _convertBool(inData.water)
  };
}

/**
 * Parses string data in the query data.
 *
 * @param inData - Data to convert
 * @returns - Parsed data
 */
export function translate5in1x31(inData: ISmartHub5in1x31Query): IAcurite5in1x31 {
  const baseData = translateBase(inData);

  return {
    ...baseData,
    mt: inData.mt,
    windspeedmph: Number(inData.windspeedmph),
    winddir: Number(inData.winddir),
    rainin: Number(inData.rainin),
    dailyrainin: Number(inData.dailyrainin)
  };
}

/**
 * Parses string data in the query data.
 *
 * @param inData - Data to convert
 * @returns - Parsed data
 */
export function translate5in1x38(inData: ISmartHub5in1x38Query): IAcurite5in1x38 {
  const baseData = translateBase(inData);

  return {
    ...baseData,
    mt: inData.mt,
    tempf: Number(inData.tempf),
    humidity: Number(inData.humidity),
    windspeedmph: Number(inData.windspeedmph)
  };
}

/**
 * Parses string data in the query data.
 *
 * @param inData - Data to convert
 * @returns - Parsed data
 */
export function translateSmartHub(inData: IAcuriteSmartHubRawQueryData): IAcuriteData {
  let resultData: IAcuriteData;

  switch (inData.mt) {
  case IAcuriteTowerType.tower:
    resultData = translateTower(inData);
    break;
  case IAcuriteTowerType.FiveInOneX31:
    resultData = translate5in1x31(inData);
    break;
  case IAcuriteTowerType.FiveInOneX38:
    resultData = translate5in1x38(inData);
    break;
  case IAcuriteTowerType.ProIn:
    resultData = translateProIn(inData);
    break;
  }
  
  return resultData;
}