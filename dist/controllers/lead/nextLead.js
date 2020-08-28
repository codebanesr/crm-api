"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchNextLead = void 0;
const Campaign_1 = __importDefault(require("../../models/Campaign"));
const lead_1 = __importDefault(require("../../models/lead"));
exports.fetchNextLead = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { campaignId, leadStatus } = req.params;
    // cache this call
    const campaign = yield Campaign_1.default.findOne({ _id: campaignId }).lean().exec();
    const result = yield lead_1.default.findOne({
        campaign: campaign.campaignName,
        leadStatus,
        $or: [
            { email: req.user.email },
            {
                email: { $exists: false }
            }
        ]
    }).sort({ _id: -1 }).lean().exec();
    return res.status(200).send({ result });
});
//# sourceMappingURL=nextLead.js.map