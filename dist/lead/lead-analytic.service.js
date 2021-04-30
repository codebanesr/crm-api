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
    attachCommonGraphFilters(pipeline, organization, filter) {
        var _a;
        pipeline.match({
            organization,
            updatedAt: { $gte: filter.startDate, $lt: filter.endDate },
        });
        if (((_a = filter.handler) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            pipeline.match({ email: { $in: filter.handler } });
        }
        if (filter.campaign) {
            pipeline.match({ campaignId: mongoose_2.Types.ObjectId(filter.campaign) });
        }
    }
    getGraphData(organization, getGraphDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { handler: userList, campaign, endDate, startDate } = getGraphDto;
            const pieAgg = this.leadModel.aggregate();
            const pieFilters = {
                campaignId: mongoose_2.Types.ObjectId(campaign),
                organization,
                email: { $in: userList },
                updatedAt: { $gte: startDate, $lte: endDate },
            };
            if (!userList || userList.length === 0) {
                delete pieFilters.email;
            }
            pieAgg.match(pieFilters);
            pieAgg.group({ _id: { type: "$leadStatus" }, value: { $sum: 1 } });
            pieAgg.project({ type: "$_id.type", value: "$value", _id: 0 });
            pieAgg.sort({ value: 1 });
            const stackBarData = this.leadHistoryModel.aggregate();
            const stackFilters = {
                campaign: mongoose_2.Types.ObjectId(campaign),
                organization,
                newUser: { $in: userList },
                createdAt: { $gte: startDate, $lte: endDate },
            };
            if (!userList || userList.length === 0) {
                delete stackFilters.newUser;
            }
            stackBarData.match(stackFilters);
            stackBarData.project({
                month: { $month: "$createdAt" },
                year: { $year: "$createdAt" },
                leadStatus: "$leadStatus",
            });
            stackBarData.group({
                _id: { month: "$month", year: "$year", leadStatus: "$leadStatus" },
                NOC: { $sum: 1 },
            });
            stackBarData.project({
                month: {
                    $concat: [
                        { $toString: "$_id.year" },
                        " - ",
                        { $toString: "$_id.month" },
                    ],
                },
                NOC: "$NOC",
                type: "$_id.leadStatus",
            });
            let [pieData, stackData] = yield Promise.all([
                pieAgg.exec(),
                stackBarData.exec(),
            ]);
            pieData = pieData.filter((p) => !!p.type);
            const callDetails = yield this.getTellecallerCallDetails(campaign, startDate, endDate);
            return { pieData, barData: pieData, stackData, callDetails };
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
                { $sort: { "_id.month": 1 } },
                {
                    $project: {
                        total: "$total",
                        month: "$month",
                        leadStatus: "$_id.leadStatus",
                        _id: 0,
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
                            $ne: ["$nextAction", "__closed__"],
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
            const totalLeadsInOrg = yield this.leadModel.countDocuments().lean().exec();
            return {
                totalLeadsInOrg,
                items,
                total_count: items.length,
            };
        });
    }
    getCampaignWiseLeadCount(email, organization, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const pipeline = this.leadModel.aggregate();
            this.attachCommonGraphFilters(pipeline, organization, filters);
            pipeline.group({
                _id: "$campaign",
                total: { $sum: 1 },
            });
            pipeline.project({ type: "$_id", value: "$total", percentage: "1" });
            return pipeline.exec();
        });
    }
    getCampaignWiseLeadCountPerLeadCategory(email, organization, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const XAxisLabel = "Campaign Name";
            const YAxisLabel = "Total Leads";
            const pipeline = this.leadModel.aggregate();
            this.attachCommonGraphFilters(pipeline, organization, filter);
            pipeline.group({
                _id: { campaign: "$campaign", leadStatus: "$leadStatus" },
                total: { $sum: 1 },
            });
            pipeline.project({
                _id: 0,
                type: "$_id.leadStatus",
                [YAxisLabel]: "$total",
                [XAxisLabel]: "$_id.campaign",
            });
            const stackBarData = yield pipeline.exec();
            let max = 10;
            if (stackBarData.length > 0) {
                max = lodash_1.maxBy(stackBarData, (o) => o[YAxisLabel])[YAxisLabel];
            }
            return {
                XAxisLabel,
                YAxisLabel,
                stackBarData,
                max: max * 2,
            };
        });
    }
    getUserTalktime(email, organization, filter) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const pipeline = this.leadHistoryModel.aggregate();
            pipeline.match({
                organization,
                createdAt: { $gte: filter.startDate, $lt: filter.endDate },
            });
            if (((_a = filter.handler) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                pipeline.match({ email: { $in: filter.handler } });
            }
            pipeline.group({
                _id: { email: "$newUser" },
                talktime: { $sum: "$duration" },
                totalCalls: { $sum: 1 },
            });
            pipeline.project({
                value: "$talktime",
                averageValue: { $divide: ["$talktime", "$totalCalls"] },
                type: "$_id.email",
                _id: 0,
            });
            const result = yield pipeline.exec();
            return result;
        });
    }
    getTellecallerCallDetails(campaign, startDate, endDate) {
        return this.leadHistoryModel.aggregate([
            {
                $match: {
                    campaign: mongoose_2.Types.ObjectId(campaign),
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $addFields: {
                    isAnswered: { $cond: [{ $gt: ["$duration", 0] }, 1, 0] },
                    isUnanswered: { $cond: [{ $lte: ["$duration", 0] }, 1, 0] },
                },
            },
            {
                $group: {
                    _id: { email: "$newUser" },
                    total: { $sum: 1 },
                    totalTalktime: { $sum: "$duration" },
                    answered: { $sum: "$isAnswered" },
                    unAnswered: { $sum: "$isUnanswered" },
                },
            },
            {
                $project: { email: "$_id.email", total: "$total", answered: "$answered", unAnswered: "$unAnswered", totalTalktime: "$totalTalktime" }
            }
        ]).exec();
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