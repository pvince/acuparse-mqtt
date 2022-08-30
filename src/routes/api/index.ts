import { Router } from 'express';
import statsRouter from './stats';


const apiRouter = Router();

apiRouter.use('/api', statsRouter);

export default apiRouter;