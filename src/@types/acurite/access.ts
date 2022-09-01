import { IAcuriteBatteryLevel, IAcuriteTowerType } from './acurite';

/**
 * Raw Access request data for a Tower sensor
 */
export interface IAccessTowerQuery {
  /**
   * Date & Time of the request
   */
  dateutc: Date;

  /**
   * ID of the Acurite Access station
   */
  id: string;

  /**
   * Type of sensor
   */
  mt: IAcuriteTowerType;

  /**
   * Sensor ID
   */
  sensor: string;

  /**
   * Battery level for the sensor
   */
  sensorbattery: IAcuriteBatteryLevel;

  /**
   * Signal strength of the sensor
   */
  rssi: string;

  /**
   * Battery level for the hub.
   */
  hubbattery:  IAcuriteBatteryLevel;

  /**
   * Barometer
   */
  baromin: string;

  /**
   * Humidity level
   */
  humidity: string;

  /**
   * Temperature in Fahrenheit
   */
  tempf: string;

  /**
   * Dewpoint in fahrenheit
   */
  dewptf: string;
}



/**
 * Union of the various data types we can expect to receive from Acuparse.
 */
export type IAcuriteAccessRawQueryData = IAccessTowerQuery;