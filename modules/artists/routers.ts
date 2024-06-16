// routes/artistRoutes.ts
import { Router } from 'express';
import ArtistController from './controllers';
import ArtistService from './service';
import { authMiddleware } from '../middlewares/auth-middleware';

const artistRouter = Router();
const artistService = new ArtistService();
const artistController = new ArtistController(artistService);

artistRouter.get('/artists', artistController.getArtists);
artistRouter.get('/artists/:id', artistController.getArtistById);
artistRouter.put('/artists/:id', authMiddleware, artistController.updateArtist);
artistRouter.delete('/artists/:id', authMiddleware, artistController.deleteArtist);

export default artistRouter;
