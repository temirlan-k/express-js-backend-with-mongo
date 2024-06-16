import mongoose, { Schema, Document } from 'mongoose';

export interface ISong extends Document {
    title: string;
    artist: string;
    album: string;
    genre: string;
    releaseDate: Date;
    songUrl: string;
    coverUrl: string;
}

const SongSchema: Schema = new Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String, required: true },
    genre: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    songUrl: { type: String, required: true },
    coverUrl: { type: String, required: true }
});

const SongModel = mongoose.model<ISong>('Song', SongSchema);

export default SongModel;
