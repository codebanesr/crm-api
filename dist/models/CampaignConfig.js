"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CampaignConfigSchema = new mongoose_1.default.Schema({
    name: String,
    internalField: String,
    readableField: String,
    type: String,
    checked: Boolean
});
exports.default = mongoose_1.default.model("CampaignConfig", CampaignConfigSchema);
//# sourceMappingURL=CampaignConfig.js.map