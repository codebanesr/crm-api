import { Model } from "mongoose";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { User } from "../user/interfaces/user.interface";
import { CreateOrganizationDto } from "../organization/dto";
import { Organization, ResellerOrganization } from "../organization/interface";
import { NotificationService } from "src/utils/notification.service";
export declare class SharedService {
    private readonly organizationModel;
    private readonly resellerOrganizationModel;
    private readonly userModel;
    private readonly notificationService;
    HOURS_TO_VERIFY: number;
    HOURS_TO_BLOCK: number;
    LOGIN_ATTEMPTS_TO_BLOCK: number;
    constructor(organizationModel: Model<Organization>, resellerOrganizationModel: Model<ResellerOrganization>, userModel: Model<User>, notificationService: NotificationService);
    generateOtp(): any;
    isOrganizationalPayloadValid(createOrganizationDto: CreateOrganizationDto): Promise<boolean>;
    createOrganization(createOrganizationDto: CreateOrganizationDto, resellerId?: string, resellerName?: string): Promise<{
        user: User;
        organization: Organization;
    }>;
    checkHierarchyPreconditions(createUserDto: CreateUserDto): Promise<boolean>;
    create(createUserDto: CreateUserDto, organization: string, isFirstUser?: boolean): Promise<{
        user: User;
        registrationInfo: any;
    }>;
    isEmailUnique(email: string): Promise<void>;
    setRegistrationInfo(user: any): any;
    buildRegistrationInfo(user: any): any;
    checkAndUpdateUserQuota(organizationId: string): Promise<void>;
}
