import { Router } from 'express';
import EventController from './controllers';
import EventService from './service';
import {authMiddleware} from '../middlewares/auth-middleware'
import AuthUserService from '../auth/service';

//in order to provide our frontend with the user data, we need to specify user routes

const eventRouter = Router();

const eventService = new EventService();
const authUserService = new AuthUserService();

const eventController = new EventController(eventService,authUserService);

eventRouter.get('/events/', eventController.getEvents);
eventRouter.get('/events-by-user-city/', authMiddleware, eventController.getEventsByUserCity);

eventRouter.get('/events/:id', eventController.getEventById);
eventRouter.post('/events/', eventController.createEvent);
export default eventRouter;