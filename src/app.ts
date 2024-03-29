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
import configuration from './services/configuration';

const appLog = debug('acuparse-mqtt');

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

  const HTTP_PORT = 2999;
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
  await mqttComms.startClient(configuration.mqttHost, {
    username: configuration.mqttUser,
    password: configuration.mqttPass
  });
}

/**
 * Set up the acuparse client.
 */
async function setupAcuparseClient(): Promise<void> {
  setupAcuparse(configuration.acuparseHost);
}

/**
 * Ensures the configuration is initialized.
 */
async function loadConfiguration(): Promise<void> {
  await configuration.initialize();

  if (configuration.isDebug()) {
    appLog('Running in development mode!');
  }
}

/**
 * Starts the application.
 */
async function startup(): Promise<void> {
  await loadConfiguration();
  await setupAcuparseClient();
  await startMQTT();

  const app = initializeExpress();
  await startHTTP(app);
}

startup()
  .catch((err) => {
    appLog(`Error: ${err}`);
  });