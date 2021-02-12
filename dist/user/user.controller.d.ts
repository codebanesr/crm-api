import { ResetPasswordDto } from "./dto/reset-password.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { Request as IRequest } from "express";
import { CreateUserDto } from "./dto/create-user.dto";
import { VerifyUuidDto } from "./dto/verify-uuid.dto";
import { UserService } from "./user.service";
import { RefreshAccessTokenDto } from "./dto/refresh-access-token.dto";
import { User } from "./interfaces/user.interface";
import { FindAllDto } from "../lead/dto/find-all.dto";
import { CreateForgotPasswordDto } from "./dto/create-forgot-password.dto";
import { PushNotificationDto } from "./dto/push-notification.dto";
import { CreateResellerDto } from "./dto/create-reseller.dto";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    register(createUserDto: CreateUserDto, user: User): Promise<any>;
    registerReseller(createResellerDto: CreateResellerDto, user: User): Promise<any>;
    getAllUsersHack(user: User): Promise<any>;
    getUserById(user: User, userid: string): Promise<User>;
    verifyEmail(req: IRequest, verifyUuidDto: VerifyUuidDto): Promise<{
        fullName: string;
        email: string;
        accessToken: string;
        refreshToken: string;
    }>;
    login(req: IRequest, loginUserDto: LoginUserDto): Promise<{
        fullName: string;
        email: string;
        roleType: string;
        accessToken: string;
        refreshToken: string;
    }>;
    refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto): Promise<{
        accessToken: string;
    }>;
    forgotPassword(req: IRequest, createForgotPasswordDto: CreateForgotPasswordDto): Promise<{
        email: string;
        message: string;
    }>;
    forgotPasswordVerify(req: IRequest, body: VerifyUuidDto): Promise<{
        email: string;
        forgotPassword: import("./interfaces/forgot-password.interface").ForgotPassword;
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        email: string;
        message: string;
    }>;
    findAll(user: User, assigned: string, findAllDto: FindAllDto): Promise<any>;
    getAllManagers(user: User, userEmail: string): Promise<Pick<User, "password" | "_id" | "roles" | "email" | "fullName" | "roleType" | "reportsTo" | "verification" | "verified" | "verificationExpires" | "loginAttempts" | "blockExpires" | "bankAccountNumber" | "bankAccountName" | "batLvl" | "singleLoginKey" | "history" | "hierarchyWeight" | "organization" | "pushtoken">[]>;
    managersForReassignment(user: User, assigned: string): Promise<string[]>;
    add(req: any, assigned: string, file: any, user: User): Promise<import("./interfaces/admin-actions.interface").AdminAction>;
    updateUser(userid: string, user: CreateUserDto): Promise<any>;
    subscribeToPush(user: User, body: PushNotificationDto): Promise<{
        message: string;
    }>;
    sendPushNotification(req: IRequest, body: VerifyUuidDto): Promise<void>;
}
