/* eslint-disable jsdoc/require-jsdoc */
/**
 * @file Type information for the Acuparse API. Skipping writing comments for everything because I don't have pre-written
 *       documentation, and I don't feel like putting forth the effort...
 */

export enum TrendType {
  falling = 'falling',
  steady = 'steady',
  rising = 'rising'
}

export enum AcuparseDataType {
  tower,
  main
}

export interface IAcuparseCommon  {
  tempF: number;
  tempF_high: number;
  tempF_low: number;
  tempF_trend: TrendType;
  tempC:  number;
  tempC_high: number;
  tempC_low:  number;
  high_temp_recorded: Date;
  low_temp_recorded: Date;
  relH: string;
  relH_trend: TrendType;
  lastUpdated: Date;

}

export interface IAcuparseTower extends IAcuparseCommon {
  type: AcuparseDataType.tower;
  name: string;
}

export interface IAcuparseMain extends IAcuparseCommon {
  type: AcuparseDataType.main;
  feelsF: number | null;
  feelsC: number | null;
  dewptF: number;
  dewptC: number;
  windSpeedMPH: number;
  windSpeedKMH: number;
  windDEG: number;
  windDIR: string;
  windDEG_peak: number;
  windDIR_peak: string;
  windSpeedMPH_peak: number;
  windSpeedKMH_peak: number;
  windSpeed_peak_recorded: Date;
  windBeaufort: number;
  windGuestDEG: number | null;
  windGuestKMH: number | null;
  windGustDEGPeak: number | null;
  windGustDIRPeak: string;
  windGuestPeakRecorded: Date | null;
  windAvgMPH: number;
  windAvgKMH: number;
  rainIN: number;
  rainMM: number;
  rainTotalIN_today: number;
  rainTotalMM_today: number;
  pressure_inHg: number;
  pressure_kPa: number;
  pressure_trend: TrendType;
  sunrise: Date;
  sunset: Date;
  moonrise: Date;
  moonset: Date;
  moon_age: number;
  moon_stage: string;
  moon_illumination: number;
  moon_nextNew: Date;
  moon_nextFull: Date;
  moon_lastNew: Date;
  moon_lastFull: Date;
}

export type IAcuparseType = IAcuparseMain | IAcuparseTower;

/**
 * Response structure from the ./api/v1/json/tower endpoint
 */
export interface IAcuparseTowerResponse {
  towers: {
    [key: string]: IAcuparseTower;
  };
}

/**
 * Response structure from the ./api/v1/json/dashboard endpoint
 */
export type IAcuparseDashboardResponse = [IAcuparseMain, IAcuparseTowerResponse];