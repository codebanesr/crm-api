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
exports.uploadConfig = exports.getDispositionForCampaign = exports.getCampaignTypes = exports.getHandlerEmailHints = void 0;
const Campaign_1 = __importDefault(require("../../models/Campaign"));
const parseExcel_1 = __importDefault(require("../../util/parseExcel"));
const Disposition_1 = __importDefault(require("../../models/Disposition"));
const helper_1 = require("./helper");
exports.getHandlerEmailHints = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = 15;
    const { partialEmail } = req.query;
    const result = yield Campaign_1.default.aggregate([
        {
            $match: {
                handler: { $regex: `^${partialEmail}` }
            }
        }, {
            $project: { handler: 1, _id: 0 }
        },
        { $limit: limit }
    ]);
    return res.status(200).send(result.map(r => r.handler));
});
exports.getCampaignTypes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { hint } = req.query;
    const result = yield Campaign_1.default.find({ type: { $regex: "^" + hint, $options: "I" } }).limit(20);
    return res.status(200).send(result);
});
exports.getDispositionForCampaign = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { campaignId } = req.params;
    if (campaignId == "core") {
        helper_1.defaultDisposition(res);
    }
    else {
        let disposition = yield Disposition_1.default.findOne({ campaign: campaignId });
        return res.status(200).json(disposition);
    }
});
exports.uploadConfig = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const path = req.file.path;
    const excelObject = parseExcel_1.default(path);
});
//# sourceMappingURL=campaign.js.map