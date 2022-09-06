import { Request, Response, Router } from 'express';
import dataReportingService from '../../services/dataReportingService';
import { constants } from 'http2';

/**
 * Assists with serializing the map data.
 *
 * @param key - Key of the data to serialize
 * @param value - Value to  serialize
 * @returns - Returns the serialized data.
 */
function mapReplacer(key: string, value: unknown): unknown {
  if (value instanceof Map) {
    const result: { [key: string]: unknown } = {};
    for (const [mapKey, mapValue] of value) {
      result[mapKey] = mapValue;
    }
    return result;
  } else {
    return value;
  }
}

/**
 * Request handler for Acurite requests.
 *
 * @param req - Client request
 * @param res - Server Response
 */
function handleGetSensors(req: Request, res: Response): void  {
  // Reply w/ a 200 - OK
  const data = JSON.stringify(dataReportingService.getLatestReadings(), mapReplacer);
  res.status(constants.HTTP_STATUS_OK);
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
}

const sensorsRouter = Router();

sensorsRouter.get('/v1/sensors/known', handleGetSensors);
export default sensorsRouter;