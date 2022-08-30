import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import debug from 'debug';
import { IAcuriteTowerQuery } from '../@types/acurite';
import { translate } from '../acuparse/acuriteTranslator';
import { OK } from 'http-status';
import dataReportingService from '../services/dataReportingService';
import { logAcuriteRequest } from '../services/statistics';

const acuriteRouter = express.Router();

const expressLog = debug('acuparse-mqtt:express');

/**
 * Request handler for Acurite requests.
 *
 * @param req - Client request
 * @param res - Server Response
 */
async function handleAcuriteRequest(req: Request, res: Response): Promise<void>  {
  expressLog(`Received data from station ${req.query.id} for sensor ${req.query.sensor} which is a ${req.query.mt}`);

  if (req.query.id) {
    // This is a dirty hack, because I am feeling lazy
    const towerQuery = req.query as unknown as IAcuriteTowerQuery;
    const towerData = translate(towerQuery);

    logAcuriteRequest(towerData);

    await dataReportingService.addSensorReading(towerData);
  }

  // Reply w/ a 200 - OK
  res.status(OK);
  res.end();
}


acuriteRouter.get('/weatherstation/updateweatherstation', asyncHandler(handleAcuriteRequest));

export default acuriteRouter;