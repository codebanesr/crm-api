import { BadRequestException, Injectable, Logger, PreconditionFailedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { generate } from "otp-generator";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { User } from "../user/interfaces/user.interface";
import { RoleType } from "./role-type.enum";
import { addHours } from "date-fns";
import { v4 as uuidv4 } from 'uuid';
import { CreateOrganizationDto } from "../organization/dto";
import { Organization, ResellerOrganization } from "../organization/interface";


@Injectable()
export class SharedService {
    HOURS_TO_VERIFY = 4;
    HOURS_TO_BLOCK = 6;
    LOGIN_ATTEMPTS_TO_BLOCK = 5;

    constructor(
        @InjectModel("Organization")
        private readonly organizationModel: Model<Organization>,
    
        
        @InjectModel("ResellerOrganization")
        private readonly resellerOrganizationModel: Model<ResellerOrganization>,
    
        @InjectModel("User") private readonly userModel: Model<User>
    ) {}

    generateOtp() {
        return generate(6, { upperCase: false, specialChars: false })
    }

    async isOrganizationalPayloadValid(
        createOrganizationDto: CreateOrganizationDto
    ) {
        // const correctOTP = await this.getOTPForNumber(
        //     createOrganizationDto.phoneNumber
        // );
        // const { email, phoneNumber, name } = createOrganizationDto;
        // const count = await this.organizationModel.count({
        //   $or: [{ name }, { email }, { phoneNumber }],
        // });
        // Logger.debug({ count });
        // if (createOrganizationDto.otp !== correctOTP) {
        //   throw new HttpException("Incorrect otp", 421);
        // }
        // if (count !== 0) {
        //   throw new ConflictException();
        // }

        return true;
    }

    /** @Todo everything should happen in a transaction */
    async createOrganization(
        createOrganizationDto: CreateOrganizationDto,
        resellerId?: string,
        resellerName?: string
    ) {
        const { email, fullName, password, phoneNumber } = createOrganizationDto;
        await this.isOrganizationalPayloadValid(createOrganizationDto);
        // now save organization information in the user schema...

        const session = await this.organizationModel.db.startSession();

        session.startTransaction();
        try {
            const organization = new this.organizationModel(createOrganizationDto);
            const result = await organization.save();

            if (resellerId && resellerName) {
                await this.resellerOrganizationModel.create({
                    credit: 300,
                    orgId: result._id,
                    orgName: result.name,
                    resellerId,
                    resellerName,
                });
            }

            const { user } = await this.create({
                email,
                fullName,
                password,
                roleType: RoleType.admin,
                phoneNumber,
            },
                result._id,
                true
            );

            await session.commitTransaction();
            return { user, organization };
        } catch (e) {
            Logger.error("Transaction aborted", e);
            await session.abortTransaction();
        } finally {
            session.endSession();
        }
    }


    async checkHierarchyPreconditions(createUserDto: CreateUserDto) {
        const { reportsTo, roleType: userRoleType } = createUserDto;
        const manager = await this.userModel
            .findOne({ email: reportsTo }, { roleType: 1 })
            .lean()
            .exec();

        if (manager.roleType === RoleType.frontline) {
            throw new PreconditionFailedException("Cannot report to a frontline");
        } else if (userRoleType === RoleType.frontline) {
            return true;
        } else if (
            userRoleType === RoleType.manager &&
            manager.roleType === RoleType.manager
        ) {
            throw new PreconditionFailedException(
                "manager cannot report to a manager"
            );
        } else if (
            userRoleType === RoleType.seniorManager &&
            [RoleType.manager, RoleType.seniorManager].includes(manager.roleType)
        ) {
            throw new PreconditionFailedException(
                "Senior manager can only report to admin"
            );
        } else if (userRoleType === RoleType.admin && !!manager.roleType) {
            throw new PreconditionFailedException("Admin cannot report to anyone");
        }
    }


    async create(
        createUserDto: CreateUserDto,
        organization: string,
        isFirstUser: boolean = false
    ) {
        !isFirstUser && (await this.checkHierarchyPreconditions(createUserDto));

        /** @Todo this should be handled inside a transaction */
        await this.checkAndUpdateUserQuota(organization);
        const user = new this.userModel({
            ...createUserDto,
            organization,
            verified: true,
        });

        /** @Todo remove this duplicate variable and slowly remove this dependency */
        user.roles = [createUserDto.roleType];

        await this.isEmailUnique(user.email);
        this.setRegistrationInfo(user);
        await user.save();
        const registrationInfo = this.buildRegistrationInfo(user);


        return { user, registrationInfo };
    }

    async isEmailUnique(email: string) {
        const user = await this.userModel.findOne({ email, verified: true });
        if (user) {
            throw new BadRequestException("Email most be unique.");
        }
    }


    setRegistrationInfo(user): any {
        user.verification = uuidv4();
        user.verificationExpires = addHours(new Date(), this.HOURS_TO_VERIFY);
    }

    buildRegistrationInfo(user): any {
        const userRegistrationInfo = {
            fullName: user.fullName,
            email: user.email,
            verified: user.verified,
        };
        return userRegistrationInfo;
    }


    async checkAndUpdateUserQuota(organizationId: string) {
        const { currentSize, size } = await this.organizationModel
            .findById(organizationId, {
                size: 1,
                currentSize: 1,
            })
            .lean()
            .exec();

        if (currentSize >= size) {
            throw new BadRequestException("User quota size exceeded");
        }

        await this.organizationModel.findByIdAndUpdate(organizationId, {
            $inc: { currentSize: 1 },
        });
    }


}
