import { Request, Response } from 'express';
import { CreateUserDto } from './dtos';
import AuthUserService from './service';
import bcrypt from 'bcryptjs';
const jwt = require('jsonwebtoken');
import dotenv from 'dotenv';

dotenv.config();

let secret_key = process.env.SECRET_KEY

class AuthUserController {
    private authUserService: AuthUserService;

    constructor(authUserService: AuthUserService) {
        this.authUserService = authUserService;
    }

    createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const createUserData: CreateUserDto = req.body;

            if (!createUserData) {
                throw new Error('Invalid user data');
            }

 
            const user = await this.authUserService.insertUser(createUserData);
            res.status(201).json(user);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    loginUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                res.status(400).json({ error: 'Username and password are required' });
                return;
            }

            const user = await this.authUserService.getUserByUsername(username);

            if (!user) {
                res.status(401).json({ error: 'Authentication failed' });
                return;
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                res.status(401).json({ error: 'Authentication failed' });
                return;
            }

            const token = await this.authUserService.signJwt(username)

            res.status(200).json({user, token });
        } catch (error: any) {
            res.status(500).json({ error: 'Internal server error' });
        }
    };

}

export default AuthUserController;
