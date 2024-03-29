import 'dotenv/config';
import Ajv, { ValidateFunction } from 'ajv';
import fs from 'fs-extra';
import path from 'path';
import debug from 'debug';
import _ from 'lodash';
import chokidar, { FSWatcher } from 'chokidar';

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

const ajv = new Ajv();
let ajvValidate: ValidateFunction | null = null;

/**
 * Loads the schema file & compiles the validator.
 *
 * @returns - Schema validation function.
 */
async function getValidator(): Promise<ValidateFunction> {
  if (ajvValidate === null) {
    configLog('Loading configuration schema...');
    const schema = await fs.readJson(SCHEMA_PATH);
    ajvValidate = ajv.compile(schema);
  }
  return ajvValidate;
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
  const validate = await getValidator();
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
  /**
   * Locally stored configuration data loaded from disk.
   *
   * @protected
   */
  protected configuration: IConfigurationJson | null = null;

  /**
   * Filesystem watcher that monitors the config file.
   *
   * @protected
   */
  protected watcher: FSWatcher | null = null;

  /**
   * Returns the configured sensors.
   *
   * @returns - Sensor data. If configuration is not loaded, this returns null.
   */
  public get sensors(): ISensors | null {
    return this.configuration?.sensors ?? null;
  }

  /**
   * Retrieve the sensor configuration object.
   *
   * @param sensorID - Sensor ID (this is the raw sensor ID, eg: 0000234)
   * @returns - The sensor configuration, or null if no sensor config is found.
   */
  public getSensorConfig(sensorID: string): IKnownSensor | null {
    return this.sensors?.[sensorID] ?? null;
  }

  /**
   * Retrieves the sensors configured 'friendly' name.
   *
   * @param sensorID - ID of the sensor. (This is the raw sensor ID, eg:  0000234)
   * @returns - The sensor's friendly name, or null if no sensor config is found.
   */
  public getSensorFriendlyName(sensorID: string): string | null {
    return this.getSensorConfig(sensorID)?.sensorName ?? null;
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
    await this.loadConfiguration();

    if (this.watcher === null) {
      this.watcher = chokidar.watch(CONFIG_NAME, { ignoreInitial: true });

      this.watcher.on('add', () => this.loadConfiguration() )
        .on('change', () => this.loadConfiguration());
    }
  }

  /**
   * Should be called when the process is shutdown to ensure the watcher is stopped.
   */
  public async shutdown(): Promise<void> {
    if (this.watcher !== null) {
      await this.watcher.close();
    }
  }

  /**
   * Reload the configuration file w/ changes from disk.
   *
   * @protected
   */
  protected async loadConfiguration(): Promise<void> {
    this.configuration = await loadConfiguration();
  }
}

const configuration = new Configuration();
export default configuration;