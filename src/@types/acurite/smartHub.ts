import {
  IAcuriteActionType,
  IAcuriteBatteryLevel,
  IAcuriteBool,
  IAcuriteDateUTC,
  IAcuriteProInProbeType,
  IAcuriteTowerType
} from './acurite';

/**
 * Common fields to all acurite queries.
 */
export interface ISmartHubQueryBase {
  /**
   * Always 'now'
   */
  dateutc: IAcuriteDateUTC;

  /**
   * Always 'updateraw'
   */
  action: IAcuriteActionType;

  /**
   * Always '1' (Guessing this is a boolean 0 vs 1)
   */
  realtime: IAcuriteBool;

  /**
   * The reporting SmartHub's ID, ex: 24C86E0AF9A4
   */
  id: string;

  /**
   * The sensor's ID, ex: 00002247
   */
  sensor: string;

  /**
   * The barometer, ex: 29.99
   */
  baromin: string;

  /**
   * Battery level.
   */
  battery:  IAcuriteBatteryLevel;

  /**
   * Signal strength between sensor & base station, 1 - 4
   */
  rssi: string;
}

/**
 * Standard 'tower' sensor that just reports temperature & humidity.
 */
export interface ISmartHubTowerQuery extends ISmartHubQueryBase {
  /**
   * Type discriminator
   */
  mt: IAcuriteTowerType.tower;

  /**
   * Temperature in Fahrenheit, ex: 72.8
   */
  tempf: string;

  /**
   * Humidity percentage. Assumed range 0-100
   */
  humidity: string;
}

/**
 * Fancy indoor sensor, 'ProIn' with water sensor installed. There are at least two other sensor probes that were sold
 * but since I don't have them I cannot identify them.
 */
export interface ISmartHubProInQuery extends ISmartHubQueryBase  {
  /**
   * Type discriminator
   */
  mt: IAcuriteTowerType.ProIn;

  /**
   * Humidity percentage. Assumed range 0-100
   */
  indoorhumidity: string;

  /**
   * Temperature in Fahrenheit, ex: 72.8
   */
  indoortempf: string;

  /**
   * Type of probe installed
   */
  probe: IAcuriteProInProbeType;

  /**
   * Unknown?
   */
  check: IAcuriteBool;

  /**
   * Indicates if the water probe has detected moisture.
   */
  water: IAcuriteBool;
}

/**
 * The 5-in-1 sensor sends its data with two separate data packets. This is the data package
 * that contains rain information.
 */
export interface ISmartHub5in1x31Query extends ISmartHubQueryBase {
  /**
   * Type discriminator
   */
  mt: IAcuriteTowerType.FiveInOneX31;

  /**
   * Current wind speed
   */
  windspeedmph: string;

  /**
   * Current wind direction, 1-360
   */
  winddir: string;

  /**
   * Rain in inches. Not sure the time range.
   */
  rainin: string;

  /**
   * Daily total of rain in inches. I think this is calculated by the SmartHub
   */
  dailyrainin: string;
}

/**
 * The 5-in-1 sensor sends its data with two separate data packets. This is the data package
 * that contains temperature // humidity information.
 */
export interface ISmartHub5in1x38Query extends Omit<ISmartHubTowerQuery, 'mt'> {
  /**
   * Type discriminator
   */
  mt: IAcuriteTowerType.FiveInOneX38;

  /**
   * Current wind speed.
   */
  windspeedmph: string;
}

/**
 * Union of the various data types we can expect to receive from Acuparse.
 */
export type IAcuriteSmartHubRawQueryData = ISmartHub5in1x31Query | ISmartHub5in1x38Query | ISmartHubProInQuery | ISmartHubTowerQuery;
