import { NextFunction, Request, Response } from 'express';
import AuthUserService from '../auth/service';

const authUserService = new AuthUserService();

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    const payload = authUserService.verifyJwt(token);

    if (!payload) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }

    (req as any).user = payload;
    next();
};


