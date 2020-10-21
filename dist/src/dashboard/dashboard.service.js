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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let DashboardService = class DashboardService {
    constructor(leadModel, userModel, campaignConfigModel, campaignModel, emailTemplateModel, callLogModel) {
        this.leadModel = leadModel;
        this.userModel = userModel;
        this.campaignConfigModel = campaignConfigModel;
        this.campaignModel = campaignModel;
        this.emailTemplateModel = emailTemplateModel;
        this.callLogModel = callLogModel;
    }
    getAggregatedLeadStatus(organization, dateArray) {
        const leadAgg = this.leadModel.aggregate();
        let startDate, endDate;
        if (dateArray) {
            [startDate, endDate] = dateArray;
            startDate = new Date(startDate);
            endDate = new Date(endDate);
            leadAgg.match({
                updatedAt: { $gte: startDate, $lt: endDate },
            });
        }
        leadAgg.match({ organization });
        leadAgg.group({
            _id: { leadStatus: "$leadStatus" },
            totalAmount: { $sum: "$amount" },
        });
        return leadAgg.exec();
    }
    getAggrgegatedLeadStatusForDepartment(organization, dateArray) {
        let startDate, endDate;
        const aggregateQuery = this.leadModel.aggregate();
        if (dateArray) {
            [startDate, endDate] = dateArray;
            startDate = new Date(startDate);
            endDate = new Date(endDate);
            aggregateQuery.match({
                updatedAt: { $gte: startDate, $lt: endDate },
            });
        }
        aggregateQuery.match({ organization });
        aggregateQuery.group({
            _id: { email: "$email", leadStatus: "$leadStatus" },
            count: { $sum: 1 },
            amount: { $sum: "$amount" },
        });
        aggregateQuery.sort({ count: -1 });
        aggregateQuery.limit(3);
        aggregateQuery.project({
            email: "$_id.email",
            leadStatus: "$_id.leadStatus",
            count: "$count",
            amount: "$amount",
            _id: 0,
        });
        aggregateQuery.group({
            _id: "$email",
            leadsWithStatus: { $push: "$$ROOT" },
            allLeadCount: { $sum: "$amount" },
        });
        return aggregateQuery.exec();
    }
    getLeadInfoByMonth(organization, month) {
        return __awaiter(this, void 0, void 0, function* () {
            const leadAgg = this.leadModel.aggregate();
            leadAgg.match({ organization: organization });
            leadAgg.project({
                year: {
                    $year: "$createdAt",
                },
                month: {
                    $month: "$createdAt",
                },
                week: {
                    $week: "$createdAt",
                },
                day: {
                    $dayOfWeek: "$createdAt",
                },
                weight: { $literal: 1 },
                amount: "$amount",
            });
            leadAgg.group({
                _id: {
                    year: "$year",
                    month: "$month",
                    week: "$week",
                    day: "$day",
                },
                totalWeightDaily: {
                    $sum: "$weight",
                },
                totalAmountDaily: {
                    $sum: "$amount",
                },
            });
            leadAgg.group({
                _id: {
                    year: "$_id.year",
                    month: "$_id.month",
                    week: "$_id.week",
                },
                totalWeightWeekly: {
                    $sum: "$totalWeightDaily",
                },
                totalAmountWeekly: {
                    $sum: "$totalAmountDaily",
                },
                totalWeightDay: {
                    $push: {
                        totalWeightDay: "$totalWeightDaily",
                        totalAmountDay: "$totalAmountDaily",
                        dayOfWeek: "$_id.day",
                    },
                }
            });
            leadAgg.match({
                "_id.month": month,
            });
            return leadAgg.exec();
        });
    }
};
DashboardService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel("Lead")),
    __param(1, mongoose_1.InjectModel("User")),
    __param(2, mongoose_1.InjectModel("CampaignConfig")),
    __param(3, mongoose_1.InjectModel("Campaign")),
    __param(4, mongoose_1.InjectModel("EmailTemplate")),
    __param(5, mongoose_1.InjectModel("CallLog")),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], DashboardService);
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.service.js.map