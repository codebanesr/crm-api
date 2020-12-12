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
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const dashboard_service_1 = require("./dashboard.service");
let DashboardController = class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    getLeadStatusByOrganization(user, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization } = user;
            const { dateArray } = body;
            return this.dashboardService.getAggregatedLeadStatus(organization, dateArray);
        });
    }
    getLeadStatusByDepartment(user, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization } = user;
            const { dateArray } = body;
            return this.dashboardService.getAggrgegatedLeadStatusForDepartment(organization, dateArray);
        });
    }
    getLeadInfoByMonth(user, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization } = user;
            const { month } = body;
            return this.dashboardService.getLeadInfoByMonth(organization, month);
        });
    }
};
__decorate([
    common_1.Post("leadStatus"),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    roles_decorator_1.Roles("admin"),
    common_1.HttpCode(common_1.HttpStatus.CREATED),
    swagger_1.ApiOperation({
        summary: `Get aggregated Lead Status for a given date range,  kitne amount ka transaction fail hua, 
                    pass hua ya nurturing state me hai pie chart data `,
    }),
    swagger_1.ApiCreatedResponse({}),
    __param(0, current_user_decorator_1.CurrentUser()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getLeadStatusByOrganization", null);
__decorate([
    common_1.Post("leadStatus/department"),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    roles_decorator_1.Roles("admin"),
    common_1.HttpCode(common_1.HttpStatus.CREATED),
    swagger_1.ApiOperation({
        summary: `Get aggregated Lead Status for the department this manager belongs top, 
                            This also accepts date filter in the form of array elements
                            Top 3 frontline with highest number of leads and leads in respective stages
      `,
    }),
    swagger_1.ApiCreatedResponse({}),
    __param(0, current_user_decorator_1.CurrentUser()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getLeadStatusByDepartment", null);
__decorate([
    common_1.Post("leadStatus/monthlyReport"),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    roles_decorator_1.Roles("admin"),
    common_1.HttpCode(common_1.HttpStatus.CREATED),
    swagger_1.ApiOperation({
        summary: "Sends details about leads by week, month or cycle; new/lost/nurturing, input is the month, week and day calculation will be automatically done",
    }),
    swagger_1.ApiCreatedResponse({}),
    __param(0, current_user_decorator_1.CurrentUser()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getLeadInfoByMonth", null);
DashboardController = __decorate([
    common_1.Controller("dashboard"),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
exports.DashboardController = DashboardController;
//# sourceMappingURL=dashboard.controller.js.map