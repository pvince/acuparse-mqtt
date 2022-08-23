import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import debug from 'debug';
import * as mqttComms from './mqtt/mqttComms';
import acuriteRouter from './routes/acurite';
import { setupAcuparse } from './acuparse/acuparseClient';

const appLog = debug('acuparse-mqtt');

const MQTT_HOST = process.env.MQTT_HOST ?? 'MISSING HOST';
const MQTT_USER = process.env.MQTT_USER ?? 'MISSING USERNAME';
const MQTT_PASS = process.env.MQTT_PASS ?? 'MISSING PASSWORD';
const ACUPARSE_HOST = process.env.ACUPARSE_HOST ?? 'MISSING HOST';

/**
 * Starts the express server that listens for data input.
 */
function startExpress(): void {
  appLog('Starting web service...');
  const app = express();

  app.use(express.json());
  app.use(acuriteRouter);

  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    appLog(JSON.stringify(err));
  });

  const PORT = 3000;
  app.listen(PORT, () => {
    appLog('Started listening on port %d', PORT);
  });
}

/**
 * Starts the MQTT client
 */
async function startMQTT(): Promise<void> {
  await mqttComms.startClient(MQTT_HOST, { username: MQTT_USER, password: MQTT_PASS });
}

/**
 * Set up the acuparse client.
 */
async function setupAcuparseClient(): Promise<void> {
  setupAcuparse(ACUPARSE_HOST);
}

/**
 * Starts the application.
 */
async function startup(): Promise<void> {
  await setupAcuparseClient();
  await startMQTT();

  startExpress();
}

startup()
  .catch((err) => {
    appLog(`Error: ${err}`);
  });