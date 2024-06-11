import { Router } from 'express';
import AuthUserController from './controllers';
import AuthUserService from './service';

const userRouter = Router();

const userService = new AuthUserService();
const userController = new AuthUserController(userService);

userRouter.post('/auth/signup', userController.createUser);
userRouter.post('/auth/login', userController.loginUser);


export default userRouter;