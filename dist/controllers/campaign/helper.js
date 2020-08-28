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
exports.defaultDisposition = exports.saveCampaignSchema = void 0;
const Disposition_1 = __importDefault(require("../../models/Disposition"));
const xlsx_1 = __importDefault(require("xlsx"));
const CampaignConfig_1 = __importDefault(require("../../models/CampaignConfig"));
exports.saveCampaignSchema = (ccJSON, others) => __awaiter(void 0, void 0, void 0, function* () {
    const created = [];
    const updated = [];
    const error = [];
    for (const cc of ccJSON) {
        const { lastErrorObject, value } = yield CampaignConfig_1.default.findOneAndUpdate({ name: others.schemaName, internalField: cc.internalField }, cc, { new: true, upsert: true, rawResult: true }).lean().exec();
        if (lastErrorObject.updatedExisting === true) {
            updated.push(value);
        }
        else if (lastErrorObject.upserted) {
            created.push(value);
        }
        else {
            error.push(value);
        }
    }
    // createExcel files and update them to aws and then store the urls in database with AdminActions
    const created_ws = xlsx_1.default.utils.json_to_sheet(created);
    const updated_ws = xlsx_1.default.utils.json_to_sheet(updated);
    const wb = xlsx_1.default.utils.book_new();
    xlsx_1.default.utils.book_append_sheet(wb, updated_ws, "tickets updated");
    xlsx_1.default.utils.book_append_sheet(wb, created_ws, "tickets created");
    xlsx_1.default.writeFile(wb, "sheetjs.xlsx");
    console.log("created: ", created.length, "updated: ", updated.length, "error:", error.length);
});
/** @Todo this has to be thought better */
exports.defaultDisposition = (res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let disposition = yield Disposition_1.default.findOne({
            campaign: "5ee225b99580594afd8561dd"
        });
        if (!disposition) {
            return res.status(500).json({ error: "Core campaign schema not found, verify that creator id exists in user schema and campaignId in campaign schema... This is for core config. Also remember that during populate mongoose will look for these ids" });
        }
        return res.status(200).json(disposition);
    }
    catch (e) {
        return res.status(500).json({ e: e.message });
    }
});
//# sourceMappingURL=helper.js.map