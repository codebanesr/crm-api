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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const campaign_service_1 = require("./campaign.service");
const platform_express_1 = require("@nestjs/platform-express");
const find_campaigns_dto_1 = require("./dto/find-campaigns.dto");
const passport_1 = require("@nestjs/passport");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const update_configs_dto_1 = require("./dto/update-configs.dto");
const create_campaign_disposition_dto_1 = require("./dto/create-campaign-disposition.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_type_enum_1 = require("../shared/role-type.enum");
const delete_campaignConfig_dto_1 = require("./dto/delete-campaignConfig.dto");
const dcae_dto_1 = require("./dto/dcae.dto");
let CampaignController = class CampaignController {
    constructor(campaignService) {
        this.campaignService = campaignService;
    }
    findAll(body, user) {
        const { _id: loggedInUserId, organization, roles } = user;
        const { filters, page, perPage, sortBy } = body;
        return this.campaignService.findAll({
            page,
            perPage,
            filters,
            sortBy,
            loggedInUserId,
            organization,
            roles
        });
    }
    getDispositionForCampaign(campaignId) {
        return this.campaignService.getDispositionForCampaign(campaignId);
    }
    getHandlerEmailHints(partialEmail) {
        return this.campaignService.getHandlerEmailHints(partialEmail);
    }
    getCampaignTypes(hint, user) {
        const { organization } = user;
        return this.campaignService.getCampaignTypes(hint, organization);
    }
    uploadConfig(file) {
        return this.campaignService.uploadConfig(file);
    }
    createCampaignForm(user, body) {
        const { organization } = user;
        const { payload, campaign } = body;
        return this.campaignService.updateCampaignForm({
            payload,
            organization,
            campaign,
        });
    }
    findOneByIdOrName(campaignId) {
        return this.campaignService.findOneByIdOrName(campaignId);
    }
    getCampaignsForOrganization(organizationId) {
        return this.campaignService.getCampaignsForOrganization(organizationId);
    }
    createCampaignAndDisposition(currrentUser, body) {
        const { id: activeUserId, organization } = currrentUser;
        return this.campaignService.createCampaignAndDisposition(Object.assign(Object.assign({}, body), { activeUserId, organization }));
    }
    archiveCampaign(user, campaignId) {
        const { organization } = user;
        return this.campaignService.archiveCampaign(organization, campaignId);
    }
    updateConfigs(user, configs, campaignId, campaignName) {
        const { organization } = user;
        return this.campaignService.updateConfigs(configs, organization, campaignId, campaignName);
    }
    deleteConfig(deleteConfigDto) {
        return this.campaignService.deleteConfig(deleteConfigDto);
    }
    cloneCampaign(user, body) {
        const { campaignId } = body;
        return this.campaignService.cloneCampaign(campaignId);
    }
    deleteCampaignAndAllAssociatedEntities(dcAE) {
        return this.campaignService.deleteCampaignAndAllAssociatedEntities(dcAE);
    }
};
__decorate([
    common_1.Post("get"),
    swagger_1.ApiOperation({ summary: "Fetches all lead for the given user" }),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    __param(0, common_1.Body()), __param(1, current_user_decorator_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_campaigns_dto_1.FindCampaignsDto, Object]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "findAll", null);
__decorate([
    common_1.Get("disposition/:campaignId"),
    swagger_1.ApiOperation({
        summary: "Gets the latest version of disposition from all disposition trees added with campaign",
    }),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Param("campaignId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "getDispositionForCampaign", null);
__decorate([
    common_1.Get("autocomplete/suggestEmails"),
    swagger_1.ApiOperation({ summary: "Get list of emails for suggestion" }),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Query("partialEmail")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "getHandlerEmailHints", null);
__decorate([
    common_1.Get("autocomplete/suggestTypes"),
    swagger_1.ApiOperation({ summary: "Sends a list of suggestions for campaigns" }),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    __param(0, common_1.Query("hint")), __param(1, current_user_decorator_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "getCampaignTypes", null);
__decorate([
    common_1.Post("config/upload"),
    common_1.UseInterceptors(platform_express_1.FileInterceptor("file")),
    swagger_1.ApiOperation({ summary: "Upload a campaign config file" }),
    swagger_1.ApiConsumes("multipart/form-data"),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "uploadConfig", null);
__decorate([
    common_1.Post("/campaignForm"),
    common_1.UseInterceptors(platform_express_1.FileInterceptor("file")),
    swagger_1.ApiOperation({ summary: "Upload a campaign config file" }),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, current_user_decorator_1.CurrentUser()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "createCampaignForm", null);
__decorate([
    common_1.Get(":campaignId"),
    swagger_1.ApiOperation({ summary: "Get one campaign by id" }),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Param("campaignId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "findOneByIdOrName", null);
__decorate([
    roles_decorator_1.Roles("superAdmin"),
    common_1.Get("organization/:organizationId"),
    __param(0, common_1.Param('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "getCampaignsForOrganization", null);
__decorate([
    common_1.Post("createCampaignAndDisposition"),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    common_1.UseInterceptors(platform_express_1.FileInterceptor("campaignFile")),
    swagger_1.ApiOperation({
        summary: "Upload a campaign file and also send disposition data",
    }),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, current_user_decorator_1.CurrentUser()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_campaign_disposition_dto_1.CreateCampaignAndDispositionDto]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "createCampaignAndDisposition", null);
__decorate([
    common_1.Delete("archive/:id"),
    swagger_1.ApiOperation({ summary: "Archives a campaign" }),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, current_user_decorator_1.CurrentUser()), __param(1, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "archiveCampaign", null);
__decorate([
    common_1.Patch("addConfigs/:campaignId/:campaignName"),
    swagger_1.ApiOperation({ summary: "Adds configuration to existing campaign" }),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, current_user_decorator_1.CurrentUser()),
    __param(1, common_1.Body()),
    __param(2, common_1.Param('campaignId')),
    __param(3, common_1.Param('campaignName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_configs_dto_1.UpdateConfigsDto, String, String]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "updateConfigs", null);
__decorate([
    common_1.Post("delete/config"),
    swagger_1.ApiOperation({ summary: "Deletes single config from campaign configs schema" }),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    roles_decorator_1.Roles("admin"),
    common_1.HttpCode(common_1.HttpStatus.ACCEPTED),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_campaignConfig_dto_1.DeleteCampaignConfigDto]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "deleteConfig", null);
__decorate([
    common_1.Post("clone"),
    swagger_1.ApiOperation({ summary: "Creates a clone of the campaign whose id has been provided" }),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    common_1.HttpCode(common_1.HttpStatus.OK),
    roles_decorator_1.Roles(role_type_enum_1.RoleType.admin),
    __param(0, current_user_decorator_1.CurrentUser()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "cloneCampaign", null);
__decorate([
    common_1.Post("deleteCampaignAndAllAssociatedEntities"),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    roles_decorator_1.Roles(role_type_enum_1.RoleType.superAdmin),
    swagger_1.ApiOperation({ summary: "Deletes campaign and all associated attributes of campaign" }),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dcae_dto_1.DcaeDto]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "deleteCampaignAndAllAssociatedEntities", null);
CampaignController = __decorate([
    swagger_1.ApiTags("Campaign"),
    common_1.Controller("campaign"),
    __metadata("design:paramtypes", [campaign_service_1.CampaignService])
], CampaignController);
exports.CampaignController = CampaignController;
//# sourceMappingURL=campaign.controller.js.map