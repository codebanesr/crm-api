import { ResetPasswordDto } from "./dto/reset-password.dto";
import { AuthService } from "./../auth/auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { VerifyUuidDto } from "./dto/verify-uuid.dto";
import { RefreshAccessTokenDto } from "./dto/refresh-access-token.dto";
import { ForgotPassword } from "./interfaces/forgot-password.interface";
import { User } from "./interfaces/user.interface";
import { CreateForgotPasswordDto } from "./dto/create-forgot-password.dto";
import { Request } from "express";
import { AdminAction } from "./interfaces/admin-actions.interface";
import { FindAllDto } from "../lead/dto/find-all.dto";
import { PushNotificationDto } from "./dto/push-notification.dto";
export declare class UserService {
    private readonly userModel;
    private readonly forgotPasswordModel;
    private readonly adminActionModel;
    private readonly authService;
    HOURS_TO_VERIFY: number;
    HOURS_TO_BLOCK: number;
    LOGIN_ATTEMPTS_TO_BLOCK: number;
    constructor(userModel: Model<User>, forgotPasswordModel: Model<ForgotPassword>, adminActionModel: Model<AdminAction>, authService: AuthService);
    create(createUserDto: CreateUserDto, organization: string): Promise<any>;
    verifyEmail(req: Request, verifyUuidDto: VerifyUuidDto): Promise<{
        fullName: string;
        email: string;
        accessToken: string;
        refreshToken: string;
    }>;
    login(req: Request, loginUserDto: LoginUserDto): Promise<{
        fullName: string;
        email: string;
        roleType: string;
        accessToken: string;
        refreshToken: string;
    }>;
    refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto): Promise<{
        accessToken: string;
    }>;
    forgotPassword(req: Request, createForgotPasswordDto: CreateForgotPasswordDto): Promise<{
        email: string;
        message: string;
    }>;
    forgotPasswordVerify(req: Request, verifyUuidDto: VerifyUuidDto): Promise<{
        email: string;
        forgotPassword: ForgotPassword;
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        email: string;
        message: string;
    }>;
    getAll(user: User, assigned: string, findAllDto: FindAllDto, organization: any): Promise<any>;
    getSubordinates(user: User, organization: string): Promise<any>;
    private isEmailUnique;
    private setRegistrationInfo;
    private buildRegistrationInfo;
    private findByVerification;
    private findByEmail;
    private setUserAsVerified;
    private findUserByEmail;
    private checkPassword;
    private isUserBlocked;
    private passwordsDoNotMatch;
    private blockUser;
    private passwordsAreMatch;
    private saveForgotPassword;
    private findForgotPasswordByUuid;
    private setForgotPasswordFirstUsed;
    private findForgotPasswordByEmail;
    private setForgotPasswordFinalUsed;
    private resetUserPassword;
    insertMany(activeUserId: string, filePath: string): Promise<AdminAction>;
    addNewUsers(users: User[]): Promise<string>;
    private withManages;
    private parseManages;
    private assignHierarchyWeight;
    managersForReassignment(manages: string[], organization: string): Promise<Pick<User, "password" | "_id" | "roles" | "email" | "fullName" | "roleType" | "manages" | "verification" | "verified" | "verificationExpires" | "loginAttempts" | "blockExpires" | "bankAccountNumber" | "bankAccountName" | "batLvl" | "history" | "hierarchyWeight" | "organization" | "pushtoken">[]>;
    saveToExcel(json: any): string;
    sendEmailForgotPassword(email: string, token: string): Promise<boolean>;
    getAllUsersHack(organization: string): Promise<any>;
    getUserById(userid: string, organization: any): Promise<User>;
    updateUser(userid: string, user: CreateUserDto): Promise<any>;
    subscribeToPushNotification(userId: string, pushtoken: PushNotificationDto): Promise<{
        message: string;
    }>;
    sendPushNotification(): Promise<void>;
}
