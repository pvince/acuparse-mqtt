/**
 * Different types of known Acurite towers & the data they may provide.
 */
export enum IAcuriteTowerType  {
  tower = 'tower',
  FiveInOneX31 = '5N1x31',
  FiveInOneX38 = '5N1x38',
  ProIn = 'ProIn'

}

/**
 * Possible values for the Acurite Date UTC field
 */
export enum IAcuriteDateUTC {
  now = 'now'
}

/**
 * Possible values for the acurite action type
 */
export enum IAcuriteActionType {
  updateraw = 'updateraw'
}

/**
 * Acurite uses 0 // 1 for true & false.
 */
export enum IAcuriteBool {
  false = '0',
  true = '1'
}

/**
 * Possible values for the acurite battery level.
 */
export enum IAcuriteBatteryLevel {
  low = 'low',
  normal = 'normal'
}

/**
 * Type of probe installed in the indoor sensor.
 */
export enum IAcuriteProInProbeType {
  none = '0',
  water = '1'
}

/**
 * Common fields to all acurite queries.
 */
export interface IAcuriteQueryBase {
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
export interface IAcuriteTowerQuery extends IAcuriteQueryBase {
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
export interface IAcuriteProInQuery extends IAcuriteQueryBase  {
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
export interface IAcurite5in1x31Query  extends IAcuriteQueryBase {
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
export interface IAcurite5in1x38Query extends Omit<IAcuriteTowerQuery, 'mt'> {
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
export type IAcuriteRawQueryData = IAcurite5in1x31Query | IAcurite5in1x38Query | IAcuriteProInQuery | IAcuriteTowerQuery;
