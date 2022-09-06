import { Router } from 'express';
import statsRouter from './statsRouter';
import sensorsRouter from './sensorsRouter';


const apiRouter = Router();

apiRouter.use('/api', statsRouter);
apiRouter.use('/api', sensorsRouter);

export default apiRouter;