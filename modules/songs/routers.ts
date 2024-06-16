import { Router } from 'express';
import SongController from './controllers';
import SongService from './service';
import { authMiddleware } from '../middlewares/auth-middleware';
import multer from 'multer';

const upload = multer();

const songRouter = Router();
const songService = new SongService();
const songController = new SongController(songService);

songRouter.get('/songs', songController.getSongs);
songRouter.get('/:id', songController.getSongById);
songRouter.put('/:id', authMiddleware, songController.updateSong);
songRouter.delete('/:id', authMiddleware, songController.deleteSong);

export default songRouter;
