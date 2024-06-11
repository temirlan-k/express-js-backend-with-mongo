import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
    try {
        const db_url = process.env.MONGO_URL;

        if (!db_url) {
            throw new Error('MONGO_URL is not defined in the environment variables');
        }

        await mongoose.connect(db_url);
        console.log('MongoDB connected');
        console.log(process.env.MONGO_URL);
        console.log('===');

    } catch (err) {
        console.error('MongoDB connection error: ', err);
        process.exit(1);
    }
};

export default connectDB;
