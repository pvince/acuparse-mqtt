import { IAcuriteData } from '../acuparse/acurite.types';
import { MultiValueSensor } from '../homeassistant/sensors/sensors';

/**
 * Basic definition of a string -> number dictionary
 */
export interface IStatisticEntry {
  /**
   * Count of t imes this entry has been seen
   */
  count: number;

  /**
   * Last time this entry has been encountered
   */
  lastUpdated: Date;
}

/**
 * Grouped statistics information
 */
export interface IStatisticsCategory {
  [key: string]: IStatisticEntry;
}

/**
 * Defines the interface for our cached statistics.
 */
export interface IStatistics {
  /**
   * Counts the number of acurite requests we handled, broken down by individual sensor.
   */
  acuriteRequests: IStatisticsCategory;
  /**
   * Counts the number of sensor publish events we have sent for sensor states, broken down by individual sensor.
   */
  sensorPublishes: IStatisticsCategory;

  /**
   * Counts the number of MQTT publishes that have happened, broken down by topic.
   */
  mqttPublishes: IStatisticsCategory;
}

/**
 * Stat counters
 */
export const statCounters:  IStatistics = {
  acuriteRequests: {},
  sensorPublishes: {},
  mqttPublishes: {}
};

/**
 * Common log incrementation logic
 *
 * @param key - Log entry key
 * @param logObject - The log cache object.
 */
function incrementLog(key: string, logObject: IStatisticsCategory): void {
  let statisticsEntry = logObject[key];

  if (statisticsEntry === undefined) {
    // No existing entry, create a default initial entry
    statisticsEntry = {
      count: 1,
      lastUpdated: new Date()
    };
    logObject[key] = statisticsEntry;
  } else {
    // Update the existing entry
    statisticsEntry.count++;
    statisticsEntry.lastUpdated = new Date();
  }
}

/**
 * Logs an incoming acurite request.
 *
 * @param acuriteData - Acurite data.
 */
export function logAcuriteRequest(acuriteData: IAcuriteData): void {
  incrementLog(acuriteData.sensor, statCounters.acuriteRequests);
}

/**
 * Log when a sensor's data is published.
 *
 * @param sensor - Sensor that was published.
 */
export function logSensorPublish(sensor: MultiValueSensor): void {
  incrementLog(sensor.getSensorID(), statCounters.sensorPublishes);
}

/**
 * Count each MQTT topic publish event.
 *
 * @param topic - MQTT topic
 */
export function logMQTTPublish(topic: string): void {
  incrementLog(topic, statCounters.mqttPublishes);
}