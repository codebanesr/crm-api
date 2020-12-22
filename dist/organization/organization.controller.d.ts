import { CreateOrganizationDto } from './dto/create-organization.dto';
import { GenerateTokenDto } from './dto/generate-token.dto';
import { ValidateNewOrganizationDto } from './dto/validation.dto';
import { OrganizationService } from './organization.service';
export declare class OrganizationController {
    private organizationService;
    constructor(organizationService: OrganizationService);
    register(createOrganizationDto: CreateOrganizationDto): Promise<import("@nestjs/common").ImATeapotException>;
    generateToken(generateTokenDto: GenerateTokenDto): Promise<import("twilio/lib/rest/api/v2010/account/message").MessageInstance>;
    isValidAttribute(validateNewOrganizationDto: ValidateNewOrganizationDto): Promise<void>;
}
