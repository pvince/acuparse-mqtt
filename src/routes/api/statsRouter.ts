import { Request, Response,  Router } from 'express';
import { statCounters } from '../../services/statistics';

/**
 * Request handler for Acurite requests.
 *
 * @param req - Client request
 * @param res - Server Response
 */
function handleStatusRequest(req: Request, res: Response): void  {
  // Reply w/ a 200 - OK
  res.json(statCounters);
  res.send();
}

const statsRouter = Router();

statsRouter.get('/v1/stats', handleStatusRequest);

export default statsRouter;