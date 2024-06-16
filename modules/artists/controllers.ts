// controllers/artistController.ts
import { Request, Response } from 'express';
import ArtistService from './service';

interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
}


class ArtistController {
    private artistService: ArtistService;

    constructor(artistService: ArtistService) {
        this.artistService = artistService;
    }

    getArtists = async (req: Request, res: Response): Promise<void> => {
        try {
            const { offset = '0', limit = '10', sortBy = 'name', sortDirection = 'asc' } = req.query;
            const parsedOffset = parseInt(offset as string, 10);
            const parsedLimit = parseInt(limit as string, 10);

            const artists = await this.artistService.getArtists(parsedOffset, parsedLimit, sortBy as string, sortDirection as 'asc' | 'desc');
            res.status(200).json(artists);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error getting artists:', error.message);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.status(500).json({ error: 'Unknown error occurred' });
            }
        }
    }

    getArtistById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const artist = await this.artistService.getArtistById(id);
            if (!artist) {
                res.status(404).json({ message: 'Artist not found' });
                return;
            }
            res.status(200).json(artist);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error getting artist by ID:', error.message);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.status(500).json({ error: 'Unknown error occurred' });
            }
        }
    }


    updateArtist = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const artistData = req.body;
            const updatedArtist = await this.artistService.updateArtist(id, artistData);
            if (!updatedArtist) {
                res.status(404).json({ message: 'Artist not found' });
                return;
            }
            res.status(200).json(updatedArtist);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error updating artist:', error.message);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.status(500).json({ error: 'Unknown error occurred' });
            }
        }
    }

    deleteArtist = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            await this.artistService.deleteArtist(id);
            res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error deleting artist:', error.message);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.status(500).json({ error: 'Unknown error occurred' });
            }
        }
    }
}

export default ArtistController;
