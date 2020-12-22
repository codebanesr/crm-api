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
exports.AgentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const agent_service_1 = require("./agent.service");
const passport_1 = require("@nestjs/passport");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const battery_status_dto_1 = require("./schemas/battery-status.dto");
const add_location_dto_1 = require("./dto/add-location.dto");
const get_user_locations_dto_1 = require("./dto/get-user-locations.dto");
let AgentController = class AgentController {
    constructor(agentService) {
        this.agentService = agentService;
    }
    getUsersPerformance(user, skip = 0, fileType, sortBy = 'handler', me, campaign) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: activeUserId, organization } = user;
            return this.agentService.listActions(activeUserId, organization, skip, fileType, sortBy, me, campaign);
        });
    }
    downloadFile(res, location) {
        return __awaiter(this, void 0, void 0, function* () {
            this.agentService.downloadFile(location, res);
        });
    }
    batteryStatus(batLvl, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = user;
            return this.agentService.updateBatteryStatus(_id, batLvl);
        });
    }
    addVisitTrack(user, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = user;
            return this.agentService.addVisitTrack(_id, payload);
        });
    }
    getVisitTrack(body, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userIds } = body;
            const { email, organization, roleType } = user;
            return this.agentService.getVisitTrack(email, roleType, organization, userIds);
        });
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
    __metadata("design:returntype", Promise)
], AgentController.prototype, "getUsersPerformance", null);
__decorate([
    common_1.Get("download"),
    swagger_1.ApiOperation({ summary: "Get all admin actions" }),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Res()),
    __param(1, common_1.Query("location")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "downloadFile", null);
__decorate([
    common_1.Post("batteryStatus"),
    swagger_1.ApiOperation({ summary: "Updates the battery status when it changes" }),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    __param(0, common_1.Body()),
    __param(1, current_user_decorator_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [battery_status_dto_1.BatteryStatusDto, Object]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "batteryStatus", null);
__decorate([
    common_1.Post("visitTrack"),
    swagger_1.ApiOperation({ summary: "Update users visiting location" }),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    __param(0, current_user_decorator_1.CurrentUser()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_location_dto_1.AddLocationDto]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "addVisitTrack", null);
__decorate([
    common_1.Post("visitTrack/get"),
    __param(0, common_1.Body()), __param(1, current_user_decorator_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_user_locations_dto_1.GetUsersLocationsDto, Object]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "getVisitTrack", null);
AgentController = __decorate([
    swagger_1.ApiTags("Agent"),
    common_1.Controller("agent"),
    common_1.UseGuards(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [agent_service_1.AgentService])
], AgentController);
exports.AgentController = AgentController;
//# sourceMappingURL=agent.controller.js.map