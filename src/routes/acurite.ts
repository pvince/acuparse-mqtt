import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import debug from 'debug';
import { IAcuriteSmartHubRawQueryData } from '../@types/acurite/smartHub';
import { translateSmartHub } from '../acuparse/smartHubTranslator';
import { OK } from 'http-status';
import dataReportingService from '../services/dataReportingService';
import { logAcuriteRequest } from '../services/statistics';
import { IAcuriteAccessRawQueryData } from '../@types/acurite/access';
import { translateAccess } from '../acuparse/accessTranslator';

const acuriteRouter = express.Router();

const expressLog = debug('acuparse-mqtt:express');
const smartHubLog = expressLog.extend('smartHub');
const accessLog = expressLog.extend('access');

/**
 * Request handler for Acurite SmartHub requests.
 *
 * @param req - Client request
 * @param res - Server Response
 */
async function handleSmartHubRequest(req: Request, res: Response): Promise<void>  {
  smartHubLog(`Received data from SmartHub ${req.query.id} for sensor ${req.query.sensor} which is a ${req.query.mt}`);

  if (req.query.id) {
    // This is a dirty hack, because I am feeling lazy
    const towerQuery = req.query as unknown as IAcuriteSmartHubRawQueryData;
    const towerData = translateSmartHub(towerQuery);

    logAcuriteRequest(towerData);

    await dataReportingService.addSensorReading(towerData);
  }
  // Reply w/ a 200 - OK
  res.status(OK);
  res.end();
}

/**
 * Request handler for Acurite Access requests.
 *
 * @param req - Client Requests
 * @param res - Server Response
 */
async function handleAccessRequest(req: Request, res: Response): Promise<void> {
  accessLog(`Received data from Access ${req.query.id} for sensor ${req.query.sensor} which is a ${req.query.mt}`);

  if (req.query.id) {
    const queryData = req.query as unknown as IAcuriteAccessRawQueryData;
    const acuriteData = translateAccess(queryData);

    logAcuriteRequest(acuriteData);

    await dataReportingService.addSensorReading(acuriteData);
  }

  // Reply w/ a 200 - OK
  res.status(OK);
  res.end();

  return Promise.resolve();
}


acuriteRouter.get('/weatherstation/updateweatherstation', asyncHandler(handleSmartHubRequest));
acuriteRouter.post('/weatherstation/updateweatherstation', asyncHandler(handleAccessRequest));

export default acuriteRouter;