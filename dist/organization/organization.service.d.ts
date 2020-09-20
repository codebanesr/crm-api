import { TwilioService } from "@lkaric/twilio-nestjs";
import { ImATeapotException } from "@nestjs/common";
import { Model } from "mongoose";
import { SharedService } from "src/shared/shared.service";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { GenerateTokenDto } from "./dto/generate-token.dto";
import { Organization } from "./interface/organization.interface";
import { RedisService } from "nestjs-redis";
import { ValidateNewOrganizationDto } from "./dto/validation.dto";
import { UserService } from "../user/user.service";
export declare class OrganizationService {
    private readonly organizationalModel;
    private readonly twilioService;
    private readonly sharedService;
    private readonly redisService;
    private userService;
    constructor(organizationalModel: Model<Organization>, twilioService: TwilioService, sharedService: SharedService, redisService: RedisService, userService: UserService);
    createOrganization(createOrganizationDto: CreateOrganizationDto): Promise<ImATeapotException>;
    generateToken(generateTokenDto: GenerateTokenDto): Promise<import("twilio/lib/rest/api/v2010/account/message").MessageInstance>;
    getOTPForNumber(mobileNumber: string): Promise<string>;
    sendOtp(otp: any, mobileNumber: any): Promise<import("twilio/lib/rest/api/v2010/account/message").MessageInstance>;
    isAttributeValid(validationDto: ValidateNewOrganizationDto): Promise<void>;
    isOrganizationalPayloadValid(createOrganizationDto: CreateOrganizationDto): Promise<void>;
}
