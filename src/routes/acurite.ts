import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import debug from 'debug';
import { IAcuriteTowerQuery } from '../@types/acurite';
import { translate } from '../acuparse/acuriteTranslator';
import { publish } from '../mqtt/mqttComms';
import { OK } from 'http-status';

const router = express.Router();

const acuriteLog = debug('acuparse-mqtt:acurite');

/**
 * Request handler for Acurite requests.
 *
 * @param req - Client request
 * @param res - Server Response
 */
async function handleAcuriteRequest(req: Request, res: Response): Promise<void>  {
  acuriteLog(`Received data from station ${req.query.id} for sensor ${req.query.sensor} which is a ${req.query.mt}`);

  if (req.query.id) {
    // This is a dirty hack, because I am feeling lazy
    const towerQuery = req.query as unknown as IAcuriteTowerQuery;

    const towerData = translate(towerQuery);

    const publishPath = `acuparse-mqtt/${towerData.sensor}_${towerData.mt}`;
    await publish(publishPath, towerData);
  }

  // Reply w/ a 200 - OK
  res.status(OK);
  res.end();
}


router.get('/weatherstation/updateweatherstation', asyncHandler(handleAcuriteRequest));

export default router;