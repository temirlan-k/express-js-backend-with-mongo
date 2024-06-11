import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
    name: string;
    description?: string;
    city: string;
    date: Date;
    location: string;
    duration: string;
    rating: number;

}

const EventSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    city: { type: String, required: true },
    date: { type: Date, default: Date.now },
    location: { type: String, required: true },
    duration: { type: String, required: true },
    rating: { type: Number, required: true } 
});

const EventModel = mongoose.model<IEvent>('Event', EventSchema);

export default EventModel;
