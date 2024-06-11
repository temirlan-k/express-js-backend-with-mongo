import { Router } from 'express';
import eventRouter from '../modules/events/routers';
import userRouter from '../modules/auth/routers';


const globalRouter = Router();
globalRouter.use(eventRouter);
globalRouter.use(userRouter)

export default globalRouter;