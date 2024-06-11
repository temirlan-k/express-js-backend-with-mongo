// controllers.ts
import { Request, Response } from 'express';
import { CreateUserDto } from './dtos';
import AuthUserService from './service';

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

            const result = await this.authUserService.loginUser(username, password);
            console.log(result)
            if (!result) {
                res.status(401).json({ error: 'Invalid username or password' });
                return;
            }

            const { user, accessToken, refreshToken } = result;
            res.status(200).json({ user, accessToken, refreshToken });
        } catch (error: any) {
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}

export default AuthUserController;
