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
let CampaignController = class CampaignController {
    constructor(campaignService) {
        this.campaignService = campaignService;
    }
    findAll(body) {
        const { filters, page, perPage, sortBy } = body;
        return this.campaignService.findAll(page, perPage, filters, sortBy);
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
    findOneByIdOrName(campaignId, identifier) {
        return this.campaignService.findOneByIdOrName(campaignId, identifier);
    }
    createCampaignAndDisposition(currrentUser, file, body) {
        const { id: activeUserId } = currrentUser;
        const { dispositionData, campaignInfo } = body;
        return this.campaignService.createCampaignAndDisposition(activeUserId, file, dispositionData, campaignInfo);
    }
};
__decorate([
    common_1.Post("get"),
    swagger_1.ApiOperation({ summary: "Fetches all lead for the given user" }),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_campaigns_dto_1.FindCampaignsDto]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "findAll", null);
__decorate([
    common_1.Get("disposition/:campaignId"),
    swagger_1.ApiOperation({ summary: "Gets the latest version of disposition from all disposition trees added with campaign" }),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Param('campaignId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "getDispositionForCampaign", null);
__decorate([
    common_1.Get("autocomplete/suggestEmails"),
    swagger_1.ApiOperation({ summary: "Get list of emails for suggestion" }),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Query('partialEmail')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "getHandlerEmailHints", null);
__decorate([
    common_1.Get("autocomplete/suggestTypes"),
    swagger_1.ApiOperation({ summary: "Sends a list of suggestions for campaigns" }),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(passport_1.AuthGuard('jwt')),
    __param(0, common_1.Query('hint')), __param(1, current_user_decorator_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "getCampaignTypes", null);
__decorate([
    common_1.Post("config/upload"),
    common_1.UseInterceptors(platform_express_1.FileInterceptor("file")),
    swagger_1.ApiOperation({ summary: "Upload a campaign config file" }),
    swagger_1.ApiConsumes('multipart/form-data'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "uploadConfig", null);
__decorate([
    common_1.Get(":campaignId"),
    swagger_1.ApiOperation({ summary: "Get one campaign by id" }),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.CacheTTL(300),
    __param(0, common_1.Param('campaignId')), __param(1, common_1.Query('identifier')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "findOneByIdOrName", null);
__decorate([
    common_1.Post("createCampaignAndDisposition"),
    common_1.UseGuards(passport_1.AuthGuard('jwt')),
    common_1.UseInterceptors(platform_express_1.FileInterceptor("campaignFile")),
    swagger_1.ApiOperation({
        summary: "Upload a campaign file and also send disposition data",
    }),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, current_user_decorator_1.CurrentUser()),
    __param(1, common_1.UploadedFile()),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "createCampaignAndDisposition", null);
CampaignController = __decorate([
    swagger_1.ApiTags("Campaign"),
    common_1.Controller("campaign"),
    __metadata("design:paramtypes", [campaign_service_1.CampaignService])
], CampaignController);
exports.CampaignController = CampaignController;
//# sourceMappingURL=campaign.controller.js.map