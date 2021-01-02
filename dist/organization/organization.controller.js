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
exports.OrganizationController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const create_organization_dto_1 = require("./dto/create-organization.dto");
const generate_token_dto_1 = require("./dto/generate-token.dto");
const validation_dto_1 = require("./dto/validation.dto");
const organization_service_1 = require("./organization.service");
const update_quota_dto_1 = require("./dto/update-quota.dto");
let OrganizationController = class OrganizationController {
    constructor(organizationService) {
        this.organizationService = organizationService;
    }
    register(createOrganizationDto, user) {
        return __awaiter(this, void 0, void 0, function* () {
            common_1.Logger.debug(createOrganizationDto);
            const { _id, fullName } = user;
            return this.organizationService.createOrganization(createOrganizationDto, _id, fullName);
        });
    }
    getAllResellerOrganizations(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = user;
            return this.organizationService.getAllResellerOrganization(_id);
        });
    }
    generateToken(generateTokenDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.organizationService.generateToken(generateTokenDto);
        });
    }
    createOrUpdateUserQuota(updateQuota) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.organizationService.createOrUpdateUserQuota(updateQuota);
        });
    }
    isValidAttribute(validateNewOrganizationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.organizationService.isAttributeValid(validateNewOrganizationDto);
        });
    }
    getPayments(organization) {
        return __awaiter(this, void 0, void 0, function* () {
            common_1.Logger.debug(organization);
            return this.organizationService.getAllPayments(organization);
        });
    }
};
__decorate([
    common_1.Post(),
    common_1.HttpCode(common_1.HttpStatus.CREATED),
    swagger_1.ApiOperation({ summary: "Registers Organization and automatically creates a user for that organization" }),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    roles_decorator_1.Roles("reseller"),
    swagger_1.ApiCreatedResponse({}),
    __param(0, common_1.Body()), __param(1, current_user_decorator_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_organization_dto_1.CreateOrganizationDto, Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "register", null);
__decorate([
    swagger_1.ApiOperation({ summary: "Get all organization details for logged in reseller" }),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    roles_decorator_1.Roles("reseller"),
    common_1.Get('reseller'),
    __param(0, current_user_decorator_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getAllResellerOrganizations", null);
__decorate([
    common_1.Post("otp"),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    roles_decorator_1.Roles("reseller"),
    common_1.HttpCode(common_1.HttpStatus.CREATED),
    swagger_1.ApiOperation({ summary: "Generates an otp for given mobile number and sends it to that number" }),
    swagger_1.ApiCreatedResponse({}),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_token_dto_1.GenerateTokenDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "generateToken", null);
__decorate([
    common_1.Post("quota"),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    roles_decorator_1.Roles("reseller"),
    common_1.HttpCode(common_1.HttpStatus.CREATED),
    swagger_1.ApiOperation({ summary: "Generates an otp for given mobile number and sends it to that number" }),
    swagger_1.ApiCreatedResponse({}),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_quota_dto_1.UpdateQuotaDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "createOrUpdateUserQuota", null);
__decorate([
    common_1.Post("isValid"),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    swagger_1.ApiOperation({ summary: "Validate create-organization paylod" }),
    swagger_1.ApiCreatedResponse({}),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [validation_dto_1.ValidateNewOrganizationDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "isValidAttribute", null);
__decorate([
    common_1.Get("transactions"),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    swagger_1.ApiOperation({ summary: "Validate create-organization paylod" }),
    swagger_1.ApiCreatedResponse({}),
    __param(0, common_1.Query('organization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getPayments", null);
OrganizationController = __decorate([
    common_1.Controller('organization'),
    swagger_1.ApiTags("organization"),
    __metadata("design:paramtypes", [organization_service_1.OrganizationService])
], OrganizationController);
exports.OrganizationController = OrganizationController;
//# sourceMappingURL=organization.controller.js.map