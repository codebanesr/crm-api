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
exports.OrganizationService = void 0;
const twilio_nestjs_1 = require("@lkaric/twilio-nestjs");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_service_1 = require("../shared/shared.service");
const nestjs_redis_1 = require("nestjs-redis");
const config_1 = require("../config/config");
const user_service_1 = require("../user/user.service");
const moment = require("moment");
const role_type_enum_1 = require("../shared/role-type.enum");
let OrganizationService = class OrganizationService {
    constructor(organizationalModel, resellerOrganizationModel, transactionModel, twilioService, sharedService, redisService, userService) {
        this.organizationalModel = organizationalModel;
        this.resellerOrganizationModel = resellerOrganizationModel;
        this.transactionModel = transactionModel;
        this.twilioService = twilioService;
        this.sharedService = sharedService;
        this.redisService = redisService;
        this.userService = userService;
    }
    createOrganization(createOrganizationDto, resellerId, resellerName) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, fullName, password, phoneNumber } = createOrganizationDto;
            yield this.isOrganizationalPayloadValid(createOrganizationDto);
            const organization = new this.organizationalModel(createOrganizationDto);
            const result = yield organization.save();
            yield this.resellerOrganizationModel.create({
                credit: 300,
                orgId: result._id,
                orgName: result.name,
                resellerId,
                resellerName,
            });
            yield this.userService.create({
                email,
                fullName,
                password,
                roleType: role_type_enum_1.RoleType.admin,
                phoneNumber,
            }, result._id, true);
        });
    }
    getAllResellerOrganization(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.resellerOrganizationModel.find({ resellerId: id });
        });
    }
    generateToken(generateTokenDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { mobileNumber } = generateTokenDto;
            const client = yield this.redisService.getClient();
            let otp = yield client.get(mobileNumber);
            if (!otp) {
                otp = this.sharedService.generateOtp();
                yield client.set(mobileNumber, otp, "EX", 300);
            }
            return this.sendOtp(otp, mobileNumber);
        });
    }
    getOTPForNumber(mobileNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = this.redisService.getClient();
            return client.get(mobileNumber);
        });
    }
    sendOtp(otp, mobileNumber) {
        common_1.Logger.debug({ otp, mobileNumber });
        return this.twilioService.client.messages.create({
            body: `Please use this to confirm your account ${otp}`,
            from: config_1.default.twilio.mobileNumber,
            to: mobileNumber,
        });
    }
    isAttributeValid(validationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { label, value } = validationDto;
            const count = yield this.organizationalModel.count({ [label]: value });
            if (count != 0) {
                throw new common_1.ConflictException(`An organization with this ${label} ${value} already exists`);
            }
        });
    }
    isOrganizationalPayloadValid(createOrganizationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
    createOrUpdateUserQuota(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const { discount, months, perUserRate, seats, total: UITotal, organization, } = obj;
            const total = perUserRate * (1 - 0.01 * discount) * seats * months;
            if (total !== UITotal) {
                throw new common_1.PreconditionFailedException();
            }
            const expiresOn = moment().add(months, "M");
            return this.transactionModel.create({
                discount,
                perUserRate,
                seats,
                total,
                expiresOn: expiresOn.toDate(),
                organization,
            });
        });
    }
    getAllPayments(organization) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transactionModel
                .find({ organization })
                .sort({ _id: 1 })
                .limit(15);
        });
    }
    getAllOrganizations() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.organizationalModel.find().lean().exec();
        });
    }
};
OrganizationService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel("Organization")),
    __param(1, mongoose_1.InjectModel("ResellerOrganization")),
    __param(2, mongoose_1.InjectModel("Transaction")),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        twilio_nestjs_1.TwilioService,
        shared_service_1.SharedService,
        nestjs_redis_1.RedisService,
        user_service_1.UserService])
], OrganizationService);
exports.OrganizationService = OrganizationService;
//# sourceMappingURL=organization.service.js.map