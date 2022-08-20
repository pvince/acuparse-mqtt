import {
  IAcurite5in1x31Query, IAcurite5in1x38Query,
  IAcuriteBool,
  IAcuriteDateUTC, IAcuriteProInQuery,
  IAcuriteQueryBase,
  IAcuriteRawQueryData,
  IAcuriteTowerQuery,
  IAcuriteTowerType
} from '../@types/acurite';
import {
  IAcuriteData,
  IAcuriteBaseData,
  IAcuriteTowerData,
  IAcuriteProInData,
  IAcurite5in1x31Data, IAcurite5in1x38Data
} from './acurite.types';

const _convertBool = (inBool: IAcuriteBool): boolean => inBool === IAcuriteBool.true;

/**
 * Converts common data.
 *
 * @param inData - Data to convert
 * @returns - Returns the parsed data.
 */
export function translateBase(inData: IAcuriteQueryBase): IAcuriteBaseData {
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
export function translateTower(inData: IAcuriteTowerQuery): IAcuriteTowerData {
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
export function translateProIn(inData: IAcuriteProInQuery): IAcuriteProInData {
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
export function translate5in1x31(inData: IAcurite5in1x31Query): IAcurite5in1x31Data {
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
export function translate5in1x38(inData: IAcurite5in1x38Query): IAcurite5in1x38Data {
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
export function translate(inData: IAcuriteRawQueryData): IAcuriteData {
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