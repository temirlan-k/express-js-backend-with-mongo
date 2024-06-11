import { Request, Response } from 'express';
import mongoose from 'mongoose';
import EventModel, { IEvent } from './models';
import { CreateEventDto } from './dtos';
import { SortOrder } from 'mongoose';

class EventService{


    async getEvents(
        offset: number = 0,
        limit: number = 10,
        sortBy: string = 'rating',
        sortDirection: 'asc' | 'desc' = 'desc'
    ): Promise<IEvent[]> {
        const sortOptions: { [key: string]: SortOrder } = { [sortBy]: sortDirection === 'asc' ? 1 : -1 };

        try {
            return await EventModel.find().skip(offset).limit(limit).sort(sortOptions).exec();
        } catch (error) {
            throw new Error('Unable to fetch events');
        }
    }

    
    async getEventsByUserCity(city: string): Promise<IEvent[]>{
        return await EventModel.find({city}).exec()
    }

    async getEventById(id: string): Promise<IEvent | null >{
        return await EventModel.findById(id).exec()
    }

    async insertEvent(createEventDTO: CreateEventDto): Promise<IEvent>{
        const { name, description, city, date, location, duration, rating } = createEventDTO;
        const newEvent = new EventModel({
            name,
            description,
            city,
            date,
            location,
            duration,
            rating
        })
        await newEvent.save()
        return newEvent;

        
    }
}



export default EventService