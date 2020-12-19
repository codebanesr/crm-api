"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadSchema = void 0;
const mongoose_1 = require("mongoose");
exports.LeadSchema = new mongoose_1.Schema({
    externalId: { type: String },
    email: String,
    contact: [
        {
            label: String,
            value: String,
            category: String,
        },
    ],
    campaign: String,
    campaignId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Campaign" },
    firstName: String,
    lastName: String,
    source: String,
    amount: Number,
    leadStatus: String,
    address: String,
    followUp: Date,
    companyName: String,
    state: String,
    pincode: Number,
    nextAction: String,
    organization: { type: mongoose_1.Schema.Types.ObjectId, ref: "Organization" },
    documentLinks: [String]
}, {
    timestamps: true,
    autoIndex: true,
    strict: false,
});
exports.LeadSchema.index({ "$**": "text" });
//# sourceMappingURL=lead.schema.js.map