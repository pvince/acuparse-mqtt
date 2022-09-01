/**
 * @file This file has more Javascript appropriate interpretations of the raw Acurite query data.
 */
import { IAcuriteBatteryLevel, IAcuriteProInProbeType, IAcuriteTowerType } from '../@types/acurite/acurite';

/**
 * Base Acurite data that has had text converted to numbers
 */
export interface IAcuriteBase {
  /**
   * Date & Time that the acuparse-mqtt received this data.
   */
  dateutc: Date;

  /**
   * Always '1' (Guessing this is a boolean 0 vs 1)
   */
  realtime: boolean;

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
  baromin: number;

  /**
   * Battery level.
   */
  battery:  IAcuriteBatteryLevel;

  /**
   * Signal strength between sensor & base station, 1 - 4
   */
  rssi: number;
}

/**
 * Standard 'tower' sensor that just reports temperature & humidity.
 */
export interface IAcuriteTower extends IAcuriteBase {
  /**
   * Type discriminator
   */
  mt: IAcuriteTowerType.tower;

  /**
   * Temperature in Fahrenheit, ex: 72.8
   */
  tempf: number;

  /**
   * Humidity percentage. Assumed range 0-100
   */
  humidity: number;
}

/**
 * Fancy indoor sensor, 'ProIn' with water sensor installed. There are at least two other sensor probes that were sold
 * but since I don't have them I cannot identify them.
 */
export interface IAcuriteProIn extends Omit<IAcuriteTower, 'mt'>   {
  /**
   * Type discriminator
   */
  mt: IAcuriteTowerType.ProIn;

  /**
   * Type of probe installed
   */
  probe: IAcuriteProInProbeType;

  /**
   * Unknown?
   */
  check: boolean;

  /**
   * Indicates if the water probe has detected moisture.
   */
  water: boolean;
}

/**
 * The 5-in-1 sensor sends its data with two separate data packets. This is the data package
 * that contains rain information.
 */
export interface IAcurite5in1x31 extends IAcuriteBase {
  /**
   * Type discriminator
   */
  mt: IAcuriteTowerType.FiveInOneX31;

  /**
   * Current wind speed
   */
  windspeedmph: number;

  /**
   * Current wind direction, 1-360
   */
  winddir: number;

  /**
   * Rain in inches. Not sure the time range.
   */
  rainin: number;

  /**
   * Daily total of rain in inches. I think this is calculated by the SmartHub
   */
  dailyrainin: number;
}

/**
 * The 5-in-1 sensor sends its data with two separate data packets. This is the data package
 * that contains temperature // humidity information.
 */
export interface IAcurite5in1x38 extends Omit<IAcuriteTower, 'mt'> {
  /**
   * Type discriminator
   */
  mt: IAcuriteTowerType.FiveInOneX38;

  /**
   * Current wind speed.
   */
  windspeedmph: number;
}

/**
 * Union of the various data types that supply temperature & humidity data.
 */
export type IAcuriteDataWithTemperature = IAcurite5in1x38 | IAcuriteProIn | IAcuriteTower;

/**
 * Union of the various data types that supply wind speed information.
 */
export type IAcuriteDataWithWind = IAcurite5in1x31 | IAcurite5in1x38;

/**
 * Union of the various data types we can expect to receive from Acuparse.
 */
export type IAcuriteData = IAcurite5in1x31 | IAcurite5in1x38 | IAcuriteProIn | IAcuriteTower;
