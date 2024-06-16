// models/artist.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IArtist extends Document {
    name: string;
    genre: string;
    bio?: string;
    imageUrl?: string;
}

const ArtistSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    genre: { type: String, required: true },
    bio: { type: String },
    imageUrl: { type: String }
});

const ArtistModel = mongoose.model<IArtist>('Artist', ArtistSchema);

export default ArtistModel;
