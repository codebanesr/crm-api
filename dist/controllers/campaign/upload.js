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
exports.createCampaignAndDisposition = void 0;
const parseExcel_1 = __importDefault(require("../../util/parseExcel"));
const Campaign_1 = __importDefault(require("../../models/Campaign"));
const Disposition_1 = __importDefault(require("../../models/Disposition"));
const helper_1 = require("./helper");
exports.createCampaignAndDisposition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userid } = req.user;
    let { dispositionData, campaignInfo } = req.body;
    dispositionData = JSON.parse(dispositionData);
    campaignInfo = JSON.parse(campaignInfo);
    const ccJSON = parseExcel_1.default(req.file.path);
    const campaign = yield Campaign_1.default.findOneAndUpdate({ campaignName: campaignInfo.campaignName }, Object.assign(Object.assign({}, campaignInfo), { createdBy: userid }), { new: true, upsert: true, rawResult: true });
    const campaignResult = yield helper_1.saveCampaignSchema(ccJSON, { schemaName: campaignInfo.campaignName });
    let disposition = new Disposition_1.default({ options: dispositionData, campaign: campaign.value.id });
    disposition = yield disposition.save();
    return res.status(200).json({
        campaign: campaign.value,
        disposition,
        campaignResult
    });
});
//# sourceMappingURL=upload.js.map