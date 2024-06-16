import { Request, Response } from 'express';
import SongService from './service';

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




class SongController {
    private songService: SongService;

    constructor(songService: SongService) {
        this.songService = songService;
    }

    getSongs = async (req: Request, res: Response): Promise<void> => {
        try {
            const { offset = '0', limit = '10', sortBy = 'releaseDate', sortDirection = 'desc' } = req.query;
            const parsedOffset = parseInt(offset as string, 10);
            const parsedLimit = parseInt(limit as string, 10);

            const songs = await this.songService.getSongs(parsedOffset, parsedLimit, sortBy as string, sortDirection as 'asc' | 'desc');
            res.status(200).json(songs);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error getting songs:', error.message);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.status(500).json({ error: 'Unknown error occurred' });
            }
        }
    }

    getSongById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const song = await this.songService.getSongById(id);
            if (!song) {
                res.status(404).json({ message: 'Song not found' });
                return;
            }
            res.status(200).json(song);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error getting song by ID:', error.message);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.status(500).json({ error: 'Unknown error occurred' });
            }
        }
    }

    // createSong = async (req: MulterRequest, res: Response): Promise<void> => {
    //     try {
    //         const songData = req.body;
    //         const songFile = req.files?.song?.[0];
    //         const coverFile = req.files?.cover?.[0];

    //         if (!songFile || !coverFile) {
    //             res.status(400).json({ error: 'Song file and cover file are required' });
    //             return;
    //         }

    //         const newSong = await this.songService.createSong(songData, songFile, coverFile);
    //         res.status(201).json(newSong);
    //     } catch (error) {
    //         if (error instanceof Error) {
    //             console.error('Error creating song:', error.message);
    //             res.status(500).json({ error: 'Internal server error' });
    //         } else {
    //             res.status(500).json({ error: 'Unknown error occurred' });
    //         }
    //     }
    // }

    updateSong = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const songData = req.body;
            const updatedSong = await this.songService.updateSong(id, songData);
            if (!updatedSong) {
                res.status(404).json({ message: 'Song not found' });
                return;
            }
            res.status(200).json(updatedSong);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error updating song:', error.message);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.status(500).json({ error: 'Unknown error occurred' });
            }
        }
    }

    deleteSong = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            await this.songService.deleteSong(id);
            res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error deleting song:', error.message);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.status(500).json({ error: 'Unknown error occurred' });
            }
        }
    }
}

export default SongController;
