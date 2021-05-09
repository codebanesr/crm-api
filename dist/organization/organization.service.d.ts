import { TwilioService } from "@lkaric/twilio-nestjs";
import { Model } from "mongoose";
import { SharedService } from "../shared/shared.service";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { GenerateTokenDto } from "./dto/generate-token.dto";
import { Organization } from "./interface/organization.interface";
import { RedisService } from "nestjs-redis";
import { ValidateNewOrganizationDto } from "./dto/validation.dto";
import { UserService } from "../user/user.service";
import { ResellerOrganization } from "../organization/interface/reseller-organization.interface";
import { UpdateQuotaDto } from "./dto/update-quota.dto";
import { Transaction } from "./interface/transaction.interface";
export declare class OrganizationService {
    private readonly organizationalModel;
    private readonly resellerOrganizationModel;
    private readonly transactionModel;
    private readonly twilioService;
    private readonly sharedService;
    private readonly redisService;
    private userService;
    getCurrentOrganization(organization: string): Promise<Pick<Organization, "_id" | "size" | "name" | "email" | "phoneNumber" | "accountType" | "phoneNumberPrefix" | "lastActive" | "organizationImage" | "startDate" | "endDate" | "currentSize">>;
    constructor(organizationalModel: Model<Organization>, resellerOrganizationModel: Model<ResellerOrganization>, transactionModel: Model<Transaction>, twilioService: TwilioService, sharedService: SharedService, redisService: RedisService, userService: UserService);
    createOrganization(createOrganizationDto: CreateOrganizationDto, resellerId: string, resellerName: string): Promise<void>;
    getAllResellerOrganization(id: string): Promise<ResellerOrganization[]>;
    generateToken(generateTokenDto: GenerateTokenDto): Promise<import("twilio/lib/rest/api/v2010/account/message").MessageInstance>;
    getOTPForNumber(mobileNumber: string): Promise<string>;
    sendOtp(otp: any, mobileNumber: any): Promise<import("twilio/lib/rest/api/v2010/account/message").MessageInstance>;
    isAttributeValid(validationDto: ValidateNewOrganizationDto): Promise<void>;
    isOrganizationalPayloadValid(createOrganizationDto: CreateOrganizationDto): Promise<boolean>;
    createOrUpdateUserQuota(obj: UpdateQuotaDto): Promise<Transaction>;
    getAllPayments(organization: any): Promise<Transaction[]>;
    getAllOrganizations(): Promise<Pick<Organization, "_id" | "size" | "name" | "email" | "phoneNumber" | "accountType" | "phoneNumberPrefix" | "lastActive" | "organizationImage" | "startDate" | "endDate" | "currentSize">[]>;
}
