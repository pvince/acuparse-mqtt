import 'dotenv/config';
import Ajv from 'ajv';
import fs from 'fs-extra';
import path from 'path';
import debug from 'debug';
import _ from 'lodash';

const configLog = debug('acuparse-mqtt:config');
const UNSET = '<unset>';

/**
 * Sensor configuration
 */
interface IKnownSensor {
  /**
   * Sensor name to use.
   */
  sensorName: string;
}

/**
 * Map of SensorID => Sensor Configuration
 */
interface ISensors {
  [key: string]: IKnownSensor;
}

/**
 * Configuration file structure
 */
interface IConfigurationJson {
  /**
   * Map of SensorID => Sensor configuration
   */
  sensors: ISensors;
}

const SCHEMA_PATH = path.join(__dirname, 'configuration.schema.json');
const CONFIG_NAME = 'configuration.json';
const DEFAULT_CONFIG: IConfigurationJson = { sensors: {} };
Object.freeze(DEFAULT_CONFIG);

/**
 * Loads the schema file.
 *
 * @returns - JSON Schema file that can validate the configuration.
 */
function loadSchema(): Promise<object> {
  configLog('Loading configuration schema...');
  return fs.readJson(SCHEMA_PATH);
}

/**
 * Loads the raw, unvalidated configuration file. Ensures one exists if it fails to find one.
 *
 * @returns - Raw configuration file data.
 */
async function loadRawConfigFile(): Promise<unknown> {
  let possibleConfig: unknown;
  try {
    possibleConfig = await fs.readJson(CONFIG_NAME);
  } catch (err) {
    configLog('Failed to read %s. %s', CONFIG_NAME, err);
    if (!await fs.pathExists(CONFIG_NAME)) {
      configLog('Writing default configuration to %s', CONFIG_NAME);
      await fs.writeJSON(CONFIG_NAME, DEFAULT_CONFIG, { spaces: 2 });
    }

    possibleConfig = _.cloneDeep(DEFAULT_CONFIG);
  }

  return possibleConfig;
}

/**
 * Loads the configuration file, validates that it looks like a configuration file, and returns it. If the configuration
 * file is invalid for some reason, the default configuration is returned.
 *
 * @returns Loaded configuration. On error loading the configuraiton, a default config is returned.
 */
async function loadConfiguration(): Promise<IConfigurationJson> {
  configLog('Loading configuration...');
  const possibleConfig = await loadRawConfigFile();
  const schema = await loadSchema();

  //todo: We are going to want to reuse this validator, and it shouldn't change while the application is running.
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const valid = validate(possibleConfig);

  let result: IConfigurationJson;
  if (!valid) {
    result = _.cloneDeep(DEFAULT_CONFIG);
    configLog('Configuration is invalid! %s', JSON.stringify(validate.errors, null, 2));
  } else {
    result = possibleConfig as IConfigurationJson;
    configLog('Loaded configuration');
  }

  return result;
}

/**
 * Configuration class for the process
 */
class Configuration {
  protected configuration: IConfigurationJson | null = null;

  /**
   * Returns the configured sensors.
   *
   * @returns - Sensor data. If configuration is not loaded, this returns null.
   */
  public get sensors(): ISensors | null {
    return this.configuration?.sensors ?? null;
  }

  /**
   * Retrieve the MQTT Host address. This assumes the host is running at hte default MQTT port of 1883. This setting
   * is an environment setting defined in the .env file.
   *
   * @returns - The MQTT hosto address
   * @example mqtt://localhost
   */
  public get mqttHost(): string {
    return process.env.MQTT_HOST ?? UNSET;
  }

  /**
   * Returns the MQTT username. This setting is an environment setting defined in the .env file.
   *
   * @returns - the MQTT username
   * @example mySweetUser
   */
  public get mqttUser(): string {
    return process.env.MQTT_USER ?? UNSET;
  }

  /**
   * Returns the MQTT password. This setting is an environment setting defined in the .env file.
   *
   * @returns - the MQTT password
   * @example Battery Horse Staple
   */
  public get mqttPass(): string {
    return process.env.MQTT_PASS ?? UNSET;
  }

  /**
   * Returns the acuparse host. This setting is an environment setting defined in the .env file.
   *
   * @returns - the MQTT username
   * @example http://acuparse.example.com
   */
  public get acuparseHost(): string {
    return process.env.ACUPARSE_HOST ?? UNSET;
  }

  /**
   * Is this running in debug or release mode? This setting is an environment setting defined in the .env file.
   *
   * @returns - True if we should consider this a development environment.
   */
  public isDebug(): boolean {
    //todo: If I add a build process, this should auto-toggle to 'false'
    return process.env.ISDEBUG === 'true';
  }

  /**
   * Initializes the configuration object. This should be called on startup.
   */
  public async initialize(): Promise<void> {
    this.configuration = await loadConfiguration();

    //todo: Start watching the configuration for changes & reload it.
    //todo: Add a 'shutdown' method to stop watching the configuration.
  }
}

const configuration = new Configuration();
export default configuration;