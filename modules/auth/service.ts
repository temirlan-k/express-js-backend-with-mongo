import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CreateUserDto } from "./dtos";
import UserModel, { IUser } from './models';

dotenv.config();

class AuthUserService {
    private ACCESS_SECRET_KEY: string;

    constructor() {
        const secretKey = process.env.ACCESS_SECRET_KEY;
        if (!secretKey) {
            throw new Error('ACCESS_SECRET_KEY is not defined in the environment variables');
        }
        this.ACCESS_SECRET_KEY = secretKey;
    }

    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    public async insertUser(createUserData: CreateUserDto): Promise<IUser> {
        try {
            const { email, username, password, city } = createUserData;
            const hashedPassword = await this.hashPassword(password);
            const newUser = new UserModel({
                email,
                username,
                password: hashedPassword,
                city
            });

            await newUser.save();
            return newUser;
        } catch (error) {
            console.error('Error inserting user:', error);
            throw new Error('Unable to create user');
        }
    }

    public async getUserByUsername(username: string): Promise<IUser | null> {
        return await UserModel.findOne({ username }).exec();
    }

    public verifyJwt(token: string): any {
        try {
            return jwt.verify(token, this.ACCESS_SECRET_KEY);
        } catch (err) {
            return null;
        }
    }

    public signJwt(username: string): string {
        return jwt.sign({ username }, this.ACCESS_SECRET_KEY, { expiresIn: '1h' });
    }
}

export default AuthUserService;
