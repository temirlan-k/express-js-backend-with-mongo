import { Router } from 'express';
import userRouter from '../modules/auth/routers';
import songRouter from '../modules/songs/routers';



const globalRouter = Router();
globalRouter.use(userRouter)
globalRouter.use(songRouter)


export default globalRouter;