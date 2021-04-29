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
exports.LeadAnalyticController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const get_graph_data_dto_1 = require("./dto/get-graph-data.dto");
const lead_analytic_service_1 = require("./lead-analytic.service");
let LeadAnalyticController = class LeadAnalyticController {
    constructor(analyticService) {
        this.analyticService = analyticService;
    }
    getGraphData(user, graphInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization } = user;
            return this.analyticService.getGraphData(organization, graphInput);
        });
    }
    getLeadStatusDataForLineGraph(user, graphFilter, year) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, organization } = user;
            return this.analyticService.getLeadStatusDataForLineGraph(email, organization, year);
        });
    }
    getLeadStatusCountForTelecallers(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, organization } = user;
            return this.analyticService.getLeadStatusCountForTelecallers(email, organization);
        });
    }
    getCampaignWiseLeadCount(user, graphFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, organization } = user;
            return this.analyticService.getCampaignWiseLeadCount(email, organization, graphFilter);
        });
    }
    getCampaignWiseLeadCountPerLeadCategory(user, graphFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, organization } = user;
            return this.analyticService.getCampaignWiseLeadCountPerLeadCategory(email, organization, graphFilter);
        });
    }
    getUserTalktime(user, graphFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, organization } = user;
            return this.analyticService.getUserTalktime(email, organization, graphFilter);
        });
    }
};
__decorate([
    common_1.Post('graphData'),
    swagger_1.ApiOperation({ summary: "Gets data for various types of graphs" }),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    __param(0, current_user_decorator_1.CurrentUser()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_graph_data_dto_1.GetGraphDataDto]),
    __metadata("design:returntype", Promise)
], LeadAnalyticController.prototype, "getGraphData", null);
__decorate([
    common_1.Post('leadStatusLineData'),
    swagger_1.ApiOperation({ summary: "gets count of lead by leadstatus and email, this will be represent on a line graph" }),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    roles_decorator_1.Roles('admin', 'superAdmin'),
    __param(0, current_user_decorator_1.CurrentUser()), __param(1, common_1.Body()), __param(2, common_1.Query('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_graph_data_dto_1.GetGraphDataDto, String]),
    __metadata("design:returntype", Promise)
], LeadAnalyticController.prototype, "getLeadStatusDataForLineGraph", null);
__decorate([
    common_1.Get('openClosedLeadCount'),
    swagger_1.ApiOperation({ summary: "Fetches total lead count in terms of open and closed lead for every user, this will be shown on a table" }),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    roles_decorator_1.Roles('admin', 'superAdmin'),
    __param(0, current_user_decorator_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeadAnalyticController.prototype, "getLeadStatusCountForTelecallers", null);
__decorate([
    common_1.Post('campaignWiseLeadCount'),
    swagger_1.ApiOperation({ summary: "Fetches total lead in each campaign and shows it on a bar chart" }),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    roles_decorator_1.Roles('admin', 'superAdmin'),
    __param(0, current_user_decorator_1.CurrentUser()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_graph_data_dto_1.GetGraphDataDto]),
    __metadata("design:returntype", Promise)
], LeadAnalyticController.prototype, "getCampaignWiseLeadCount", null);
__decorate([
    common_1.Post('campaignWiseLeadCountPerCategory'),
    swagger_1.ApiOperation({ summary: "Fetches total lead in each campaign by separated by category and shows it on a stack bar chart" }),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    roles_decorator_1.Roles('admin', 'superAdmin'),
    __param(0, current_user_decorator_1.CurrentUser()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_graph_data_dto_1.GetGraphDataDto]),
    __metadata("design:returntype", Promise)
], LeadAnalyticController.prototype, "getCampaignWiseLeadCountPerLeadCategory", null);
__decorate([
    common_1.Post('userTalktime'),
    swagger_1.ApiOperation({ summary: "Fetches individual users talktime and represents it in a bar graph" }),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    roles_decorator_1.Roles('admin', 'superAdmin'),
    __param(0, current_user_decorator_1.CurrentUser()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_graph_data_dto_1.GetGraphDataDto]),
    __metadata("design:returntype", Promise)
], LeadAnalyticController.prototype, "getUserTalktime", null);
LeadAnalyticController = __decorate([
    swagger_1.ApiTags("Lead Analytic"),
    common_1.Controller("lead-analytic"),
    __metadata("design:paramtypes", [lead_analytic_service_1.LeadAnalyticService])
], LeadAnalyticController);
exports.LeadAnalyticController = LeadAnalyticController;
//# sourceMappingURL=lead-analytic.controller.js.map