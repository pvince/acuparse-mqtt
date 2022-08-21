import mqtt, { AsyncMqttClient, IClientOptions } from 'async-mqtt';
import debug from 'debug';
import { IClientPublishOptions } from 'mqtt';

const log = debug('acuparse-mqtt:mqttComms');

let client: AsyncMqttClient | null = null;

/**
 * Starts the MQTT client, starts listening to error events on mqtt as well.
 *
 * @param host - Host to connect too
 * @param opts - Connection options
 */
export async function startClient(host: string, opts?: IClientOptions): Promise<void> {
  try {
    log('Starting mqtt client connecting to %s', host);
    client = await mqtt.connectAsync(host, opts);
    log('mqtt client started!');

    client.on('error', (err) => {
      log(`Error: ${err.message} ${err.stack}`);
    });
  } catch (err) {
    log(`Error: ${err}`);
  }

}

/**
 * Stops the MQTT client.
 */
export async function stopClient(): Promise<void> {
  if (client) {
    await client.end();
  }
}

/**
 * Publishes an MQTT topic
 *
 * @param topic - Topic to publish too
 * @param data - Object to JSON-ify & send
 * @param opts - MQTT options for this publish
 */
export async function publish(topic: string, data: object, opts: IClientPublishOptions = {}): Promise<void> {
  await client?.publish(topic, JSON.stringify(data), opts);
}

/**
 * Clear //  delete the specified MQTT topic.
 *
 * @param topic - Topic to clear
 */
export async function clearTopic(topic: string): Promise<void> {
  await client?.publish(topic, '', { retain: true });
}