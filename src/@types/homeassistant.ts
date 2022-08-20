/**
 * Device availability
 */
export enum Availability {
  online = 'online',
  offline = 'offline'
}

/**
 * Device availability mode
 */
export enum AvailabilityMode {
  all = 'all',
  any = 'any',
  latest = 'latest'
}

/**
 * Different sensor types
 */
export enum SensorType {
  sensor = 'sensor',
  binary_sensor = 'binary_sensor',
  cover = 'cover',
  media_player = 'media_player',
  switch = 'switch'
}

/**
 * Only available for binary sensors
 */
export enum DeviceClass_BinarySensor {
  /**
   * on means low, off means normal
   */
  battery = 'battery',
  /**
   * on means charging, off means not charging
   */
  battery_charging = 'battery_charging',
  /**
   * on means carbon monoxide detected, off no carbon monoxide (clear)
   */
  carbon_monoxide = 'carbon_monoxide',
  /**
   * on means cold, off means normal
   */
  cold = 'cold',
  /**
   * on means connected, off means disconnected
   */
  connectivity = 'connectivity',
  /**
   * on means open, off means closed
   */
  door = 'door',
  /**
   * on means open, off means closed
   */
  garage_door = 'garage_door',
  /**
   * on means gas detected, off means no gas (clear)
   */
  gas = 'gas',
  /**
   * on means hot, off means normal
   */
  heat = 'heat',
  /**
   * on means light detected, off means no light
   */
  light = 'light',
  /**
   * on means open (unlocked), off means closed (locked)
   */
  lock = 'lock',
  /**
   * on means moisture detected (wet), off means no moisture (dry)
   */
  moisture = 'moisture',
  /**
   * on means motion detected, off means no motion (clear)
   */
  motion = 'motion',
  /**
   * on means moving, off means not moving (stopped)
   */
  moving = 'moving',
  /**
   * on means occupied (detected), off means not occupied (clear)
   */
  occupancy = 'occupancy',
  /**
   * on means open, off means closed
   */
  opening = 'opening',
  /**
   * on means device is plugged in, off means device is unplugged
   */
  plug = 'plug',
  /**
   * on means power detected, off means no power
   */
  power = 'power',
  /**
   * on means home, off means away
   */
  presence = 'presence',
  /**
   * on means problem detected, off means no problem (OK)
   */
  problem = 'problem',
  /**
   * on means running, off means not running
   */
  running = 'running',
  /**
   * on means unsafe, off means safe
   */
  safety = 'safety',
  /**
   * on means smoke detected, off means no smoke (clear)
   */
  smoke = 'smoke',
  /**
   * on means sound detected, off means no sound (clear)
   */
  sound = 'sound',
  /**
   * on means tampering detected, off means no tampering (clear)
   */
  tamper = 'tamper',
  /**
   * on means update available, off means up-to-date
   */
  update = 'update',
  /**
   * on means vibration detected, off means no vibration (clear)
   */
  vibration = 'vibration',
  /**
   * on means open, off means closed
   */
  window = 'window'
}

/**
 * Only available for range based sensors
 */
export enum DeviceClass_Sensor {
  /**
   * Apparent power in VA.
   */
  apparent_power = 'apparent_power',
  /**
   * Air Quality Index
   */
  aqi = 'aqi',
  /**
   * Percentage of battery that is left
   */
  battery = 'battery',
  /**
   * Carbon Dioxide in CO2 (Smoke)
   */
  carbon_dioxide = 'carbon_dioxide',
  /**
   * Carbon Monoxide in CO (Gas CNG/LPG)
   */
  carbon_monoxide = 'carbon_monoxide',
  /**
   * Current in A
   */
  current = 'current',
  /**
   * Date string (ISO 8601)
   */
  date = 'date',
  /**
   * Duration in days, hours, minutes or seconds
   */
  duration = 'duration',
  /**
   * Energy in Wh, kWh or MWh
   */
  energy = 'energy',
  /**
   * Frequency in Hz, kHz, MHz or GHz
   */
  frequency = 'frequency',
  /**
   * Gasvolume in m³ or ft³
   */
  gas = 'gas',
  /**
   * Percentage of humidity in the air
   */
  humidity = 'humidity',
  /**
   * The current light level in lx or lm
   */
  illuminance = 'illuminance',
  /**
   * The monetary value
   */
  monetary = 'monetary',
  /**
   * Concentration of Nitrogen Dioxide in µg/m³
   */
  nitrogen_dioxide = 'nitrogen_dioxide',
  /**
   * Concentration of Nitrogen Monoxide in µg/m³
   */
  nitrogen_monoxide = 'nitrogen_monoxide',
  /**
   * Concentration of Nitrous Oxide in µg/m³
   */
  nitrous_oxide = 'nitrous_oxide',
  /**
   * Concentration of Ozone in µg/m³
   */
  ozone = 'ozone',
  /**
   * Concentration of particulate matter less than 1 micrometer in µg/m³
   */
  pm1 = 'pm1',
  /**
   * Concentration of particulate matter less than 10 micrometers in µg/m³
   */
  pm10 = 'pm10',
  /**
   * Concentration of particulate matter less than 2.5 micrometers in µg/m³
   */
  pm25 = 'pm25',
  /**
   * Power factor in %
   */
  power_factor = 'power_factor',
  /**
   * Power in W or kW
   */
  power = 'power',
  /**
   * Pressure in Pa, kPa, hPa, bar, cbar, mbar, mmHg, inHg or psi
   */
  pressure = 'pressure',
  /**
   * Reactive power in var
   */
  reactive_power = 'reactive_power',
  /**
   * Signal strength in dB or dBm
   */
  signal_strength = 'signal_strength',
  /**
   * Concentration of sulphur dioxide in µg/m³
   */
  sulphur_dioxide = 'sulphur_dioxide',
  /**
   * Temperature in °C or °F
   */
  temperature = 'temperature',
  /**
   * Datetime object or timestamp string (ISO 8601)
   */
  timestamp = 'timestamp',
  /**
   * Concentration of volatile organic compounds in µg/m³
   */
  volatile_organic_compounds = 'volatile_organic_compounds',
  /**
   * Voltage in V
   */
  voltage = 'voltage'
}

/**
 * Device class for [cover sensors]{@link https://www.home-assistant.io/integrations/cover/}
 */
export enum DeviceClass_Cover {
  /**
   * Control of an awning, such as an exterior retractable window, door, or patio cover.
   */
  awning = 'awning',
  /**
   * Control of blinds, which are linked slats that expand or collapse to cover an opening or may be tilted to partially
   * covering an opening, such as window blinds.
   */
  blind = 'blind',
  /**
   * Control of curtains or drapes, which is often fabric hung above a window or door that can be drawn open.
   */
  curtain = 'curtain',
  /**
   * Control of a mechanical damper that reduces airflow, sound, or light.
   */
  damper = 'damper',
  /**
   * Control of a door or gate that provides access to an area.
   */
  door = 'door',
  /**
   * Control of a garage door that provides access to a garage.
   */
  garage = 'garage',
  /**
   * Control of a gate. Gates are found outside of a structure and are typically part of a fence.
   */
  gate = 'gate',
  /**
   * Control of shades, which are a continuous plane of material or connected cells that expanded or collapsed over an
   * opening, such as window shades.
   */
  shade = 'shade',
  /**
   * Control of shutters, which are linked slats that swing out/in to covering an opening or may be tilted to partially
   * cover an opening, such as indoor or exterior window shutters.
   */
  shutter = 'shutter',
  /**
   * Control of a physical window that opens and closes or may tilt.
   */
  window = 'window'
}

/**
 * Device class for [media_player]{@link https://www.home-assistant.io/integrations/media_player/} sensors
 */
export enum DeviceClass_MediaPlayer {
  /**
   * Device is a television type device.
   */
  tv = 'tv',
  /**
   * Device is speaker or stereo type device.
   */
  speaker = 'speaker',
  /**
   * Device is audio video receiver type device taking audio and outputting to speakers and video to some display.
   */
  receiver = 'receiver'
}

/**
 * Device class for [switch]{@link https://www.home-assistant.io/integrations/switch/} sensors
 */
export enum DeviceClass_Switch {
  outlet = 'outlet',
  switch = 'switch'
}

/**
 * Classification of a non-primary entity. Set to config for an entity which allows changing the configuration of a
 * device, for example a switch entity making it possible to turn the background illumination of a switch on and off.
 * Set to diagnostic for an entity exposing some configuration parameter or diagnostics of a device but does not allow
 * changing it, for example a sensor showing RSSI or MAC-address.
 */
export enum EntityCategory {
  config = 'config',
  diagnostic = 'diagnostic'
}

/**
 * State class information
 */
export enum StateClass {
  /**
   * The state represents a measurement in present time, not a historical aggregation such as statistics or a prediction
   * of the future. Examples of what should be classified measurement are: current temperature, humidify or electric
   * power. Examples of what should not be classified as measurement: Forecasted temperature for tomorrow, yesterday's
   * energy consumption or anything else that doesn't include the current measurement. For supported sensors, statistics
   * of hourly min, max and average sensor readings is updated every 5 minutes.
   */
  measurement = 'measurement',

  /**
   * The state represents a total amount that can both increase and decrease, e.g. a net energy meter. Statistics of the
   * accumulated growth or decline of the sensor's value since it was first added is updated every 5 minutes. This state
   * class should not be used for sensors where the absolute value is interesting instead of the accumulated growth or
   * decline, for example remaining battery capacity or CPU load; in such cases state class measurement should be used
   * instead.
   */
  total = 'total',

  /**
   * Similar to total, with the restriction that the state represents a monotonically increasing positive total, e.g. a
   * daily amount of consumed gas, weekly water consumption or lifetime energy consumption. Statistics of the
   * accumulated growth of the sensor's value since it was first added is updated every 5 minutes. A decreasing value is
   * interpreted as the start of a new meter cycle or the replacement of the meter.
   */
  total_increasing = 'total_increasing'
}

/**
 * MQTT Sensor definition
 */
export interface IMQTTSensor {
  /**
   * A list of MQTT topics subscribed to receive availability (online/offline) updates. Must not be used together with
   * availability_topic
   *
   * https://www.home-assistant.io/integrations/sensor.mqtt/#availability
   */
  availability?: [{
    /**
     * The payload that represents the available state.
     *
     * @default online
     */
    payload_available?: Availability;

    /**
     * The payload that represents the unavailable state.
     *
     * @default offline
     */
    payload_not_available?: Availability;

    /**
     * An MQTT topic subscribed to receive availability (online/offline) updates.
     */
    topic: string;

    /**
     * Defines a [template]{@link https://www.home-assistant.io/docs/configuration/templating/#processing-incoming-data}
     * to extract device’s availability from the topic. To determine the devices’s availability
     * result of this template will be compared to payload_available and payload_not_available
     *
     * [Templates]{@link https://www.home-assistant.io/docs/configuration/templating/}
     */
    value_template?: string;
  }];

  /**
   * When availability is configured, this controls the conditions needed to set the entity to available. Valid entries
   * are all, any, and latest. If set to all, payload_available must be received on all configured availability topics
   * before the entity is marked as online. If set to any, payload_available must be received on at least one configured
   * availability topic before the entity is marked as online. If set to latest, the last payload_available or
   * payload_not_available received on any configured availability topic controls the availability.
   */
  availability_mode?: AvailabilityMode;

  /**
   * Defines a [template]{@link https://www.home-assistant.io/docs/configuration/templating/#processing-incoming-data}
   * to extract device’s availability from the availability_topic. To determine the devices’s availability result of
   * this template will be compared to payload_available and payload_not_available.
   *
   * [Templates]{@link https://www.home-assistant.io/docs/configuration/templating/}
   */
  availability_template?: string;

  /**
   * Information about the device this sensor is a part of to tie it into the
   * [device registry]{@link https://developers.home-assistant.io/docs/en/device_registry_index.html}. Only works through
   * [MQTT discovery]{@link https://www.home-assistant.io/docs/mqtt/discovery/} and when [unique_id]{@link unique_id} is
   * set. At least one of identifiers or connections must be present to identify the device.
   */
  device?: {
    /**
     * A link to the webpage that can manage the configuration of this device. Can be either an HTTP or HTTPS link.
     */
    configuration_url?: string;
    /**
     * A list of connections of the device to the outside world as a list of tuples [connection_type,
     * connection_identifier]. For example the MAC address of a network interface: "connections": [["mac", "02:5b:26:a8:dc:12"]].
     *
     * @example [["mac", "02:5b:26:a8:dc:12"]]
     */
    connections?: [string, string][];
    /**
     * A list of IDs that uniquely identify the device. For example a serial number.
     */
    identifiers?: string[] | string;
    /**
     * The manufacturer of the device.
     */
    manufacturer?: string;
    /**
     * The model of the device.
     */
    model?: string;
    /**
     * The name of the device.
     */
    name?: string;
    /**
     * Suggest an area if the device isn’t in one yet.
     */
    suggested_area?: string;
    /**
     * The firmware version of the device.
     */
    sw_version?: string;
    /**
     * Identifier of a device that routes messages between this device and Home Assistant. Examples of such devices are
     * hubs, or parent devices of a sub-device. This is used to show device topology in Home Assistant.
     */
    via_device?: string;
  };

  /**
   * The type/class of the sensor to set the icon in the frontend.
   *
   * @default None
   */
  device_class?: DeviceClass_BinarySensor | DeviceClass_Cover | DeviceClass_MediaPlayer | DeviceClass_Sensor | DeviceClass_Switch;

  /**
   * Flag which defines if the entity should be enabled when first added.
   *
   * @default true
   */
  enabled_by_default?: boolean;

  /**
   * The encoding of the payloads received. Set to "" to disable decoding of incoming payload.
   *
   * @default utf-8
   */
  encoding?: string;

  /**
   * The [category]{@link https://developers.home-assistant.io/docs/core/entity#generic-properties} of the entity.
   *
   * @default None
   */
  entity_category?: EntityCategory;

  /**
   * Defines the number of seconds after the sensor’s state expires, if it’s not updated. After expiry, the sensor’s
   * state becomes unavailable.
   *
   * @default 0
   */
  expire_after?: number;

  /**
   * Sends update events even if the value hasn’t changed. Useful if you want to have meaningful value graphs in history.
   */
  force_update?: boolean;

  /**
   * Any icon from MaterialDesignIcons.com. Prefix name with mdi:, ie mdi:home. Note: Newer icons may not yet be
   * available in the current Home Assistant release. You can check when an icon was added to MaterialDesignIcons.com at
   * MDI History.
   */
  icon?: string;

  /**
   * Defines a [template]{@link https://www.home-assistant.io/docs/configuration/templating/#processing-incoming-data}
   * to extract the last_reset. Available variables: entity_id. The entity_id can be used to  reference the entity’s
   * attributes.
   */
  json_attributes_template?: string;

  /**
   * The MQTT topic subscribed to receive a JSON dictionary payload and then set as sensor attributes. Implies
   * force_update of the current sensor state when a message is received on this topic.
   */
  json_attributes_topic?: string;

  /**
   * Defines a [template]{@link https://www.home-assistant.io/docs/configuration/templating/#processing-incoming-data}
   * to extract the last_reset. Available variables: entity_id. The entity_id can be used to reference the entity’s
   * attributes.
   */
  last_reset_value_template?: string;

  /**
   * The name of the MQTT sensor.
   *
   * @default MQTT Sensor
   */
  name?: string;

  /**
   * Used instead of name for automatic generation of entity_id
   */
  object_id?: string;

  /**
   * The payload that represents the available state.
   *
   * @default online
   */
  payload_available?: Availability;

  /**
   * The payload that represents the unavailable state.
   *
   * @default offline
   */
  payload_not_available?: Availability;

  /**
   * The maximum QoS level of the state topic.
   */
  qos?: number;

  /**
   * The [state_class]{@link https://developers.home-assistant.io/docs/core/entity/sensor#available-state-classes} of
   * the sensor.
   */
  state_class?: StateClass;

  /**
   * The MQTT topic subscribed to receive sensor values.
   */
  state_topic: string;

  /**
   * An ID that uniquely identifies this sensor. If two sensors have the same unique ID, Home Assistant will raise an
   * exception.
   */
  unique_id?: string;

  /**
   * Defines the units of measurement of the sensor, if any.
   *
   * example: F
   */
  unit_of_measurement?: string;

  /**
   * Defines a [template]{@link https://www.home-assistant.io/docs/configuration/templating/#processing-incoming-data}
   * to extract the value. Available variables: entity_id. The entity_id can be used to reference the entity’s
   * attributes. If the template throws an error, the current state will be used instead.
   */
  value_template?: string;
}

/**
 * When sending a state payload, this is the structure that should be followed.
 */
export interface IStatePayload {
  [key: string]: Date | number | string;
}