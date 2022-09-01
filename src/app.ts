import 'dotenv/config';
import express, { Express, NextFunction, Request, Response } from 'express';
import debug from 'debug';
import * as mqttComms from './mqtt/mqttComms';
import acuriteRouter from './routes/acurite';
import { setupAcuparse } from './acuparse/acuparseClient';
import apiRouter from './routes/api';
import compression from 'compression';
import { getSSLInfo } from './services/certificateManager';
import * as http from 'http';
import * as https from 'https';

const appLog = debug('acuparse-mqtt');

const MQTT_HOST = process.env.MQTT_HOST ?? 'MISSING HOST';
const MQTT_USER = process.env.MQTT_USER ?? 'MISSING USERNAME';
const MQTT_PASS = process.env.MQTT_PASS ?? 'MISSING PASSWORD';
const ACUPARSE_HOST = process.env.ACUPARSE_HOST ?? 'MISSING HOST';

/**
 * Starts the express server that listens for data input.
 *
 * @returns - Express application
 */
function initializeExpress(): Express {
  appLog('Initializing web service...');
  const app = express();

  app.use(compression());
  app.use(express.json());
  app.use(acuriteRouter);
  app.use(apiRouter);

  app.use((req: Request, res: Response, next: NextFunction) => {
    appLog('Unhandled web request: %s %s', req.method, req.originalUrl);
    next();
  });
  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    appLog(JSON.stringify(err));
  });

  return app;
}

/**
 * Start the HTTP & HTTPS servers.
 *
 * @param app - Express app
 */
async function startHTTP(app: Express): Promise<void> {
  const options = await getSSLInfo();

  const HTTP_PORT = 80;
  const HTTPS_PORT = 443;

  http.createServer(app).listen(HTTP_PORT, () => {
    appLog('Started listening for HTTP requests on port %d', HTTP_PORT);
  });

  https.createServer(options, app).listen(HTTPS_PORT, () => {
    appLog('Started listening for HTTPS requests on port %d', HTTPS_PORT);
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

  const app = initializeExpress();
  await startHTTP(app);
}

startup()
  .catch((err) => {
    appLog(`Error: ${err}`);
  });