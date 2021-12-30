import { User } from "../user/interfaces/user.interface";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { GenerateTokenDto } from "./dto/generate-token.dto";
import { ValidateNewOrganizationDto } from "./dto/validation.dto";
import { OrganizationService } from "./organization.service";
import { UpdateQuotaDto } from "./dto/update-quota.dto";
import { Logger } from "nestjs-pino";
import { SharedService } from "src/shared/shared.service";
export declare class OrganizationController {
    private organizationService;
    private logger;
    private sharedService;
    constructor(organizationService: OrganizationService, logger: Logger, sharedService: SharedService);
    getAllOrganizations(): Promise<Pick<import("./interface").Organization, "_id" | "size" | "name" | "email" | "phoneNumber" | "phoneNumberPrefix" | "organizationImage" | "startDate" | "endDate" | "accountType" | "lastActive" | "currentSize">[]>;
    register(createOrganizationDto: CreateOrganizationDto, user: User): Promise<{
        user: User;
        organization: import("./interface").Organization;
    }>;
    getAllResellerOrganizations(user: User): Promise<import("./interface").ResellerOrganization[]>;
    generateToken(generateTokenDto: GenerateTokenDto): Promise<import("twilio/lib/rest/api/v2010/account/message").MessageInstance>;
    createOrUpdateUserQuota(updateQuota: UpdateQuotaDto): Promise<import("./interface").Transaction>;
    isValidAttribute(validateNewOrganizationDto: ValidateNewOrganizationDto): Promise<void>;
    getPayments(organization: string): Promise<import("./interface").Transaction[]>;
    getCurrentOrganization(user: User): Promise<Pick<import("./interface").Organization, "_id" | "size" | "name" | "email" | "phoneNumber" | "phoneNumberPrefix" | "organizationImage" | "startDate" | "endDate" | "accountType" | "lastActive" | "currentSize">>;
    deleteCurrentOrganization(organizationId: string): Promise<void>;
}
