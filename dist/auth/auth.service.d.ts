import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Model } from 'mongoose';
import { User } from '../user/interfaces/user.interface';
import { RefreshToken } from './interfaces/refresh-token.interface';
import { Role } from './interfaces/role.interface';
import { Request } from 'express';
export declare class AuthService {
    private readonly userModel;
    private readonly refreshTokenModel;
    private readonly roleModel;
    cryptr: any;
    constructor(userModel: Model<User>, refreshTokenModel: Model<RefreshToken>, roleModel: Model<Role>);
    createAccessToken(userId: string, singleLoginKey: string): Promise<string>;
    createRefreshToken(req: Request, userId: any): Promise<string>;
    findRefreshToken(token: string): Promise<User>;
    validateUser(jwtPayload: JwtPayload): Promise<any>;
    private jwtExtractor;
    returnJwtExtractor(): (request: any) => any;
    getIp(req: any): string;
    getBrowserInfo(req: Request): string;
    getCountry(req: Request): string;
    encryptText(text: string): string;
    getPermissionsArray(roleType: string): Promise<any>;
}
