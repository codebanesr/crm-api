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
exports.LeadAnalyticService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const lodash_1 = require("lodash");
const mongoose_2 = require("mongoose");
let LeadAnalyticService = class LeadAnalyticService {
    getGraphData(organization, userList) {
        return __awaiter(this, void 0, void 0, function* () {
            const barAgg = this.leadModel.aggregate();
            barAgg.match({ organization, email: { $in: userList } });
            barAgg.group({ _id: { type: "$leadStatus" }, value: { $sum: 1 } });
            barAgg.project({ type: "$_id.type", value: "$value", _id: 0 });
            const pieAgg = this.leadHistoryModel.aggregate();
            pieAgg.match({ organization });
            pieAgg.group({ _id: { type: "$leadStatus" }, value: { $sum: 1 } });
            pieAgg.project({ type: "$_id.type", value: "$value", _id: 0 });
            const stackBarData = this.leadHistoryModel.aggregate();
            stackBarData.match({ organization, email: { $in: userList } });
            stackBarData.project({
                month: { $month: "$createdAt" },
                year: { $year: "$createdAt" },
                callStatus: "$callStatus",
            });
            stackBarData.group({
                _id: { month: "$month", year: "$year", callStatus: "$callStatus" },
                NOC: { $sum: 1 },
            });
            stackBarData.project({
                month: { $concat: ["$year", " - ", "$month"] },
                NOC: "$_id.NOC",
                type: "$_id.callStatus",
            });
            const [pieData, barData, stackData] = yield Promise.all([
                pieAgg,
                barAgg,
                stackBarData,
            ]);
            return { pieData, barData, stackData };
        });
    }
    getLeadStatusDataForLineGraph(email, organization, year) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.leadHistoryModel
                .aggregate([
                { $match: { organization } },
                {
                    $project: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        leadStatus: "$leadStatus",
                    },
                },
                { $match: { year: +year } },
                {
                    $group: {
                        _id: {
                            month: "$month",
                            year: "$year",
                            leadStatus: "$leadStatus",
                        },
                        total: { $sum: 1 },
                    },
                },
                {
                    $addFields: {
                        month: {
                            $let: {
                                vars: {
                                    monthsInString: [
                                        ,
                                        "Jan",
                                        "Feb",
                                        "Mar",
                                        "Apr",
                                        "May",
                                        "Jun",
                                        "July",
                                        "August",
                                        "September",
                                        "October",
                                        "November",
                                        "December",
                                    ],
                                },
                                in: {
                                    $arrayElemAt: ["$$monthsInString", "$_id.month"],
                                },
                            },
                        },
                    },
                },
                {
                    $project: {
                        total: "$total",
                        month: "$month",
                        leadStatus: "$_id.leadStatus",
                    },
                },
            ])
                .exec();
        });
    }
    getLeadStatusCountForTelecallers(email, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            const pipeline = this.leadModel.aggregate();
            pipeline.match({ organization });
            pipeline.addFields({
                nextActionExists: {
                    $cond: [
                        {
                            $or: [{ isPristine: false }, { $ifNull: ["$nextAction", false] }],
                        },
                        true,
                        false,
                    ],
                },
            });
            pipeline.addFields({
                open: { $cond: [{ $eq: ["$nextActionExists", true] }, 1, 0] },
                closed: { $cond: [{ $eq: ["$nextActionExists", false] }, 1, 0] },
            });
            pipeline.group({
                _id: { email: "$email" },
                totalOpen: { $sum: "$open" },
                totalClosed: { $sum: "$closed" },
            });
            pipeline.project({
                totalOpen: "$totalOpen",
                totalClosed: "$totalClosed",
                nextActionExists: "$_id.nextActionExists",
                email: "$_id.email",
                _id: 0,
            });
            const items = yield pipeline.exec();
            return {
                items,
                total_count: items.length,
            };
        });
    }
    getCampaignWiseLeadCount(email, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            const pipeline = this.leadModel.aggregate([
                {
                    $group: {
                        _id: "$campaign",
                        total: { $sum: 1 },
                    },
                },
                {
                    "$project": { type: "$_id", "value": "$total", percentage: "1" }
                }
            ]);
            return pipeline.exec();
        });
    }
    getCampaignWiseLeadCountPerLeadCategory(email, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            const XAxisLabel = 'Campaign Name';
            const YAxisLabel = 'Total Leads';
            const pipeline = this.leadModel.aggregate([
                { $match: { organization } },
                {
                    $group: {
                        _id: { campaign: "$campaign", leadStatus: "$leadStatus" },
                        total: { $sum: 1 },
                    },
                },
                {
                    "$project": { _id: 0, type: "$_id.leadStatus", [YAxisLabel]: "$total", [XAxisLabel]: "$_id.campaign" }
                }
            ]);
            const stackBarData = yield pipeline.exec();
            const max = lodash_1.maxBy(stackBarData, (o) => o[YAxisLabel])[YAxisLabel];
            return {
                XAxisLabel,
                YAxisLabel,
                stackBarData,
                max: max * 2
            };
        });
    }
    getUserTalktime(email, organization, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const pipeline = this.leadHistoryModel.aggregate();
            pipeline.match({
                organization,
                createdAt: { $gte: startDate, $lt: endDate }
            });
            pipeline.group({
                _id: { "email": "$newUser" },
                talktime: { $sum: "$duration" }
            });
            pipeline.project({
                value: "$talktime",
                type: "$_id.email",
                _id: 0
            });
            return pipeline.exec();
        });
    }
};
__decorate([
    mongoose_1.InjectModel("Lead"),
    __metadata("design:type", mongoose_2.Model)
], LeadAnalyticService.prototype, "leadModel", void 0);
__decorate([
    mongoose_1.InjectModel("LeadHistory"),
    __metadata("design:type", mongoose_2.Model)
], LeadAnalyticService.prototype, "leadHistoryModel", void 0);
LeadAnalyticService = __decorate([
    common_1.Injectable()
], LeadAnalyticService);
exports.LeadAnalyticService = LeadAnalyticService;
//# sourceMappingURL=lead-analytic.service.js.map