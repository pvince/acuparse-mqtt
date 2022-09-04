import 'dotenv/config';

const UNSET = '<unset>';

/**
 * Configuration class for the process
 */
class Configuration {
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
    //todo: If I add a buld process, this should auto-toggle to 'false'
    return process.env.ISDEBUG === 'true';
  }
}

const configuration = new Configuration();
export default configuration;