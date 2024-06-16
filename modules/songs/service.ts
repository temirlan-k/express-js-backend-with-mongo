import mongoose, { SortOrder } from 'mongoose';
import SongModel, { ISong } from './models';
import { S3 } from 'aws-sdk';
import s3 from '../../core/aws-config';

class SongService {
    private bucketName = process.env.AWS_S3_BUCKET_NAME as string;

    async getSongs(offset: number = 0, limit: number = 10, sortBy: string = 'releaseDate', sortDirection: 'asc' | 'desc' = 'desc'): Promise<ISong[]> {
        const sortOptions: { [key: string]: SortOrder } = { [sortBy]: sortDirection === 'asc' ? 1 : -1 };
        try {
            return await SongModel.find().skip(offset).limit(limit).sort(sortOptions).exec();
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('Unable to fetch songs: ' + error.message);
            }
            throw error;
        }
    }

    async getSongById(id: string): Promise<ISong | null> {
        return await SongModel.findById(id).exec();
    }

    async uploadFileToS3(file: Express.Multer.File): Promise<string> {
        const params: S3.PutObjectRequest = {
            Bucket: this.bucketName,
            Key: `songs/${Date.now()}-${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype
        };
        const { Location } = await s3.upload(params).promise();
        return Location;
    }

    async createSong(songData: any, songFile: Express.Multer.File, coverFile: Express.Multer.File): Promise<ISong> {
        const songUrl = await this.uploadFileToS3(songFile);
        const coverUrl = await this.uploadFileToS3(coverFile);

        const newSong = new SongModel({
            ...songData,
            songUrl,
            coverUrl
        });

        await newSong.save();
        return newSong;
    }

    async updateSong(id: string, songData: any): Promise<ISong | null> {
        return await SongModel.findByIdAndUpdate(id, songData, { new: true }).exec();
    }

    async deleteSong(id: string): Promise<void> {
        await SongModel.findByIdAndDelete(id).exec();
    }
}

export default SongService;
