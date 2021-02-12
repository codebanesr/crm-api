"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignConfigSchema = void 0;
const mongoose_1 = require("mongoose");
exports.CampaignConfigSchema = new mongoose_1.Schema({
    name: String,
    internalField: String,
    readableField: String,
    type: String,
    options: [String],
    checked: Boolean,
    group: String,
    organization: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Organization",
    },
    campaignId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Campaign"
    }
});
//# sourceMappingURL=campaign-config.schema.js.map