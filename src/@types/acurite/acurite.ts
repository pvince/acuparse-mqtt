/**
 * Different types of known Acurite towers & the data they may provide.
 */
export enum IAcuriteTowerType {
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