// services/artistService.ts
import ArtistModel, { IArtist } from './models'
import { S3 } from 'aws-sdk';
import s3 from '../../core/aws-config';

class ArtistService {
    private bucketName = process.env.AWS_S3_BUCKET_NAME as string;

    async getArtists(offset: number = 0, limit: number = 10, sortBy: string = 'name', sortDirection: 'asc' | 'desc' = 'asc'): Promise<IArtist[]> {
        const sortOptions: { [key: string]: 1 | -1 } = { [sortBy]: sortDirection === 'asc' ? 1 : -1 };
        try {
            return await ArtistModel.find().skip(offset).limit(limit).sort(sortOptions).exec();
        } catch (error) {
            throw new Error('Unable to fetch artists');
        }
    }

    async getArtistById(id: string): Promise<IArtist | null> {
        return await ArtistModel.findById(id).exec();
    }

    async uploadFileToS3(file: Express.Multer.File): Promise<string> {
        const params: S3.PutObjectRequest = {
            Bucket: this.bucketName,
            Key: `artists/${Date.now()}-${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype
        };
        const { Location } = await s3.upload(params).promise();
        return Location;
    }

    async createArtist(artistData: any, imageFile?: Express.Multer.File): Promise<IArtist> {
        let imageUrl;
        if (imageFile) {
            imageUrl = await this.uploadFileToS3(imageFile);
        }

        const newArtist = new ArtistModel({
            ...artistData,
            imageUrl
        });

        await newArtist.save();
        return newArtist;
    }

    async updateArtist(id: string, artistData: any): Promise<IArtist | null> {
        return await ArtistModel.findByIdAndUpdate(id, artistData, { new: true }).exec();
    }

    async deleteArtist(id: string): Promise<void> {
        await ArtistModel.findByIdAndDelete(id).exec();
    }
}

export default ArtistService;
