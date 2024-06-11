import { Request, Response } from 'express';
import EventService from "./service";
import { CreateEventDto } from './dtos';
import AuthUserService from '../auth/service';

class EventController {
    
    private eventService: EventService;
    private authUserService: AuthUserService;

    constructor(eventService: EventService, authUserService: AuthUserService) {
        this.eventService = eventService;
        this.authUserService = authUserService;
    }

    getEvents = async (req: Request, res: Response): Promise<void> => {
        try {
            const { offset = '0', limit = '10', sortBy = 'rating', sortDirection = 'desc' } = req.query;
            const parsedOffset = parseInt(offset as string, 10);
            const parsedLimit = parseInt(limit as string, 10);

            const events = await this.eventService.getEvents(
                parsedOffset,
                parsedLimit,
                sortBy as string,
                sortDirection as 'asc' | 'desc'
            );

            res.status(200).json(events);
        } catch (error: any) {
            console.error('Error getting events:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    }


    getEventsByUserCity = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const decodedToken = this.authUserService.verifyJwt(token);
            if (!decodedToken) {
                res.status(401).json({ error: 'Invalid token' });
                return;
            }

            const user = await this.authUserService.getUserByUsername(decodedToken.username);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            const events = await this.eventService.getEventsByUserCity(user.city);
            res.status(200).json(events);
        } catch (error: any) {
            console.error('Error getting events by city:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    getEventById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const event = await this.eventService.getEventById(id);
            if (!event) {
                res.status(404).json({ message: 'Event not found' });
                return;
            }
            res.status(200).json(event);
        } catch (error: any) {
            console.error('Error getting event by ID:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    createEvent = async (req: Request, res: Response): Promise<void> => {
        const createEventDto: CreateEventDto = req.body;
        try {
            const newEvent = await this.eventService.insertEvent(createEventDto);
            res.status(201).json(newEvent);
        } catch (error: any) {
            console.error('Error creating event:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default EventController;
