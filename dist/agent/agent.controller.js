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
exports.AgentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const agent_service_1 = require("./agent.service");
const passport_1 = require("@nestjs/passport");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let AgentController = class AgentController {
    constructor(agentService) {
        this.agentService = agentService;
    }
    getUsersPerformance(user, skip = 0, fileType, sortBy = 'handler', me, campaign) {
        const { id: activeUserId, organization } = user;
        return this.agentService.listActions(activeUserId, organization, skip, fileType, sortBy, me, campaign);
    }
    downloadFile(res, location) {
        this.agentService.downloadFile(location, res);
    }
};
__decorate([
    common_1.Get("listActions"),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    swagger_1.ApiOperation({ summary: "List all admin actions" }),
    roles_decorator_1.Roles('admin', 'manager'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, current_user_decorator_1.CurrentUser()),
    __param(1, common_1.Query("skip")),
    __param(2, common_1.Query("fileType")),
    __param(3, common_1.Query("sortBy")),
    __param(4, common_1.Query("me")),
    __param(5, common_1.Query("campaign")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String, String, Boolean, String]),
    __metadata("design:returntype", void 0)
], AgentController.prototype, "getUsersPerformance", null);
__decorate([
    common_1.Get("download"),
    swagger_1.ApiOperation({ summary: "Get all admin actions" }),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Res()),
    __param(1, common_1.Query("location")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AgentController.prototype, "downloadFile", null);
AgentController = __decorate([
    swagger_1.ApiTags("Agent"),
    common_1.Controller("agent"),
    common_1.UseGuards(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [agent_service_1.AgentService])
], AgentController);
exports.AgentController = AgentController;
//# sourceMappingURL=agent.controller.js.map