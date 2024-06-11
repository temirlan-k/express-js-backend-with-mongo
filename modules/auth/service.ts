// service.ts
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CreateUserDto } from "./dtos";
import UserModel, { IUser } from './models';
import RefreshTokenModel from './refreshTokenModel';

dotenv.config();

class AuthUserService {
    private ACCESS_SECRET_KEY: string;
    private REFRESH_SECRET_KEY: string;

    constructor() {
        const accessSecretKey = process.env.ACCESS_SECRET_KEY;
        const refreshSecretKey = process.env.REFRESH_SECRET_KEY;

        if (!accessSecretKey) {
            throw new Error('ACCESS_SECRET_KEY is not defined in the environment variables');
        }

        if (!refreshSecretKey) {
            throw new Error('REFRESH_SECRET_KEY is not defined in the environment variables');
        }

        this.ACCESS_SECRET_KEY = accessSecretKey;
        this.REFRESH_SECRET_KEY = refreshSecretKey;
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

    async loginUser(username: string, password: string): Promise<{ user: IUser, accessToken: string, refreshToken: string } | null> {
        const user = await UserModel.findOne({ username });
        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return null;

        const accessToken = this.signJwt(user);
        const refreshToken = this.generateRefreshToken(user);

        const refreshTokenDoc = new RefreshTokenModel({ token: refreshToken, user: user._id });
        await refreshTokenDoc.save();
        console.log(accessToken,refreshToken)
        return { user, accessToken, refreshToken };
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

    public verifyRefreshToken(token: string): any {
        try {
            return jwt.verify(token, this.REFRESH_SECRET_KEY);
        } catch (err) {
            return null;
        }
    }

    public signJwt(user: IUser): string {
        return jwt.sign({ username: user.username }, this.ACCESS_SECRET_KEY, { expiresIn: '1h' });
    }

    private generateRefreshToken(user: IUser): string {
        return jwt.sign({ username: user.username }, this.REFRESH_SECRET_KEY, { expiresIn: '7d' });
    }

    async refreshToken(oldToken: string): Promise<{ accessToken: string, refreshToken: string } | null> {
        const payload = this.verifyRefreshToken(oldToken);
        if (!payload) return null;

        const user = await UserModel.findById(payload.id);
        if (!user) return null;

        const newAccessToken = this.signJwt(user);
        const newRefreshToken = this.generateRefreshToken(user);

        const refreshTokenDoc = new RefreshTokenModel({ token: newRefreshToken, user: user._id });
        await refreshTokenDoc.save();

        await RefreshTokenModel.deleteOne({ token: oldToken });

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
}

export default AuthUserService;
