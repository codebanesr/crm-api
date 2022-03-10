"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const otp_generator_1 = require("otp-generator");
const role_type_enum_1 = require("./role-type.enum");
const date_fns_1 = require("date-fns");
const uuid_1 = require("uuid");
const notification_service_1 = require("../utils/notification.service");
let SharedService = class SharedService {
    constructor(organizationModel, resellerOrganizationModel, userModel, notificationService) {
        this.organizationModel = organizationModel;
        this.resellerOrganizationModel = resellerOrganizationModel;
        this.userModel = userModel;
        this.notificationService = notificationService;
        this.HOURS_TO_VERIFY = 4;
        this.HOURS_TO_BLOCK = 6;
        this.LOGIN_ATTEMPTS_TO_BLOCK = 5;
    }
    generateOtp() {
        return otp_generator_1.generate(6, { upperCase: false, specialChars: false });
    }
    isOrganizationalPayloadValid(createOrganizationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
    createOrganization(createOrganizationDto, resellerId, resellerName) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, fullName, password, phoneNumber } = createOrganizationDto;
            yield this.isOrganizationalPayloadValid(createOrganizationDto);
            const session = yield this.organizationModel.db.startSession();
            session.startTransaction();
            try {
                const organization = new this.organizationModel(createOrganizationDto);
                const result = yield organization.save();
                if (resellerId && resellerName) {
                    yield this.resellerOrganizationModel.create({
                        credit: 300,
                        orgId: result._id,
                        orgName: result.name,
                        resellerId,
                        resellerName,
                    });
                }
                const { user } = yield this.create({
                    email,
                    fullName,
                    password,
                    roleType: role_type_enum_1.RoleType.admin,
                    phoneNumber,
                }, result._id, true);
                yield session.commitTransaction();
                return { user, organization };
            }
            catch (e) {
                common_1.Logger.error("Transaction aborted", e);
                yield session.abortTransaction();
            }
            finally {
                session.endSession();
            }
        });
    }
    checkHierarchyPreconditions(createUserDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { reportsTo, roleType: userRoleType } = createUserDto;
            const manager = yield this.userModel
                .findOne({ email: reportsTo }, { roleType: 1 })
                .lean()
                .exec();
            if (manager.roleType === role_type_enum_1.RoleType.frontline) {
                throw new common_1.PreconditionFailedException("Cannot report to a frontline");
            }
            else if (userRoleType === role_type_enum_1.RoleType.frontline) {
                return true;
            }
            else if (userRoleType === role_type_enum_1.RoleType.manager &&
                manager.roleType === role_type_enum_1.RoleType.manager) {
                throw new common_1.PreconditionFailedException("manager cannot report to a manager");
            }
            else if (userRoleType === role_type_enum_1.RoleType.seniorManager &&
                [role_type_enum_1.RoleType.manager, role_type_enum_1.RoleType.seniorManager].includes(manager.roleType)) {
                throw new common_1.PreconditionFailedException("Senior manager can only report to admin");
            }
            else if (userRoleType === role_type_enum_1.RoleType.admin && !!manager.roleType) {
                throw new common_1.PreconditionFailedException("Admin cannot report to anyone");
            }
        });
    }
    create(createUserDto, organization, isFirstUser = false) {
        return __awaiter(this, void 0, void 0, function* () {
            !isFirstUser && (yield this.checkHierarchyPreconditions(createUserDto));
            yield this.checkAndUpdateUserQuota(organization);
            const user = new this.userModel(Object.assign(Object.assign({}, createUserDto), { organization, verified: true }));
            user.roles = [createUserDto.roleType];
            yield this.isEmailUnique(user.email);
            this.setRegistrationInfo(user);
            yield user.save();
            const registrationInfo = this.buildRegistrationInfo(user);
            yield this.notificationService.sendMail({
                from: 'onboarding@applesauce.co.in',
                to: 'shanur.cse.nitap@gmail.com',
                subject: `Welcome to applesauce! 🎉 ${user.fullName || ''}!`,
                html: `
                Hey ${user.fullName}, </br>

                Thank you for signing up for <span style="font-weight: 600;">AppleSauceCRM</span> and we welcome to the community!</br>
                
                We’re stoked to see what you’re able to onboard with our app. </br>
                
                To get started, we recommend checking out our quickstart guide that’ll walk you through the basics of the crm step-by-step. We also have a two-minute intro <a href="https://youtu.be/r-R1z2DKAhg">video</a> if you’re more of a movie buff.</br>
                
                And if you’re ready to start {action (creating, exploring, etc)}, you can log in below!
                
                <a href="http://applesauce.co.in">Login</a> </br>
                
                Cheers! </br>
                
                Shanur </br>
                cto@applesauce.co.in
            `,
                cc: 'rahman.shanur7@gmail.com'
            }).catch(error => {
                console.log({ error, message: "An error occured while sending email to user" });
            });
            return { user, registrationInfo };
        });
    }
    isEmailUnique(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userModel.findOne({ email, verified: true });
            if (user) {
                throw new common_1.BadRequestException("Email most be unique.");
            }
        });
    }
    setRegistrationInfo(user) {
        user.verification = uuid_1.v4();
        user.verificationExpires = date_fns_1.addHours(new Date(), this.HOURS_TO_VERIFY);
    }
    buildRegistrationInfo(user) {
        const userRegistrationInfo = {
            fullName: user.fullName,
            email: user.email,
            verified: user.verified,
        };
        return userRegistrationInfo;
    }
    checkAndUpdateUserQuota(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { currentSize, size } = yield this.organizationModel
                .findById(organizationId, {
                size: 1,
                currentSize: 1,
            })
                .lean()
                .exec();
            if (currentSize >= size) {
                throw new common_1.BadRequestException("User quota size exceeded");
            }
            yield this.organizationModel.findByIdAndUpdate(organizationId, {
                $inc: { currentSize: 1 },
            });
        });
    }
};
SharedService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel("Organization")),
    __param(1, mongoose_1.InjectModel("ResellerOrganization")),
    __param(2, mongoose_1.InjectModel("User")),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        notification_service_1.NotificationService])
], SharedService);
exports.SharedService = SharedService;
//# sourceMappingURL=shared.service.js.map