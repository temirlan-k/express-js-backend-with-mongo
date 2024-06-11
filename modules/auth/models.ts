import mongoose, { Schema, Document } from 'mongoose';
import { type } from 'os';

export interface IUser extends Document {
    email: string;
    username: string;
    password: string;
    city: string;
    comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    city: { type: String, required: true }
});


const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
