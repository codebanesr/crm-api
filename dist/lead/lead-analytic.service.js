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
            stackBarData.project({ "month": { "$month": "$createdAt" }, "year": { "$year": "$createdAt" }, "callStatus": "$callStatus" });
            stackBarData.group({ "_id": { "month": "$month", "year": "$year", "callStatus": "$callStatus" }, "NOC": { "$sum": 1 } });
            stackBarData.project({ "month": { "$concat": ["$year", " - ", "$month"] }, "NOC": "$_id.NOC", "type": "$_id.callStatus", });
            const [pieData, barData, stackData] = yield Promise.all([pieAgg, barAgg, stackBarData]);
            return { pieData, barData, stackData };
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