"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignSchema = void 0;
const mongoose_1 = require("mongoose");
exports.CampaignSchema = new mongoose_1.Schema({
    campaignName: { type: String, required: true },
    worklow: String,
    comment: String,
    organization: { type: mongoose_1.Types.ObjectId, ref: "Organization" },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    interval: [Date],
    assignees: { type: [String] },
    type: { type: String },
}, { timestamps: true });
//# sourceMappingURL=campaign.schema.js.map