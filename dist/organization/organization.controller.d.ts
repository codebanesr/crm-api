import { User } from "../user/interfaces/user.interface";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { GenerateTokenDto } from "./dto/generate-token.dto";
import { ValidateNewOrganizationDto } from "./dto/validation.dto";
import { OrganizationService } from "./organization.service";
import { UpdateQuotaDto } from "./dto/update-quota.dto";
import { Logger } from "nestjs-pino";
export declare class OrganizationController {
    private organizationService;
    private logger;
    constructor(organizationService: OrganizationService, logger: Logger);
    register(createOrganizationDto: CreateOrganizationDto, user: User): Promise<void>;
    getAllResellerOrganizations(user: User): Promise<import("./interface/reseller-organization.interface").ResellerOrganization[]>;
    generateToken(generateTokenDto: GenerateTokenDto): Promise<import("twilio/lib/rest/api/v2010/account/message").MessageInstance>;
    createOrUpdateUserQuota(updateQuota: UpdateQuotaDto): Promise<import("./interface/transaction.interface").Transaction>;
    isValidAttribute(validateNewOrganizationDto: ValidateNewOrganizationDto): Promise<void>;
    getPayments(organization: string): Promise<import("./interface/transaction.interface").Transaction[]>;
}
