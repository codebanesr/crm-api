"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadSchema = void 0;
const mongoose_1 = require("mongoose");
const validator_1 = require("validator");
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
    campaignId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Campaign",
        required: true
    },
    transactionCount: {
        type: Number,
        default: 0
    },
    notes: String,
    firstName: String,
    lastName: String,
    fullName: String,
    source: String,
    amount: Number,
    leadStatus: String,
    address: String,
    followUp: Date,
    companyName: String,
    state: String,
    pincode: Number,
    nextAction: { type: String, default: null },
    organization: { type: mongoose_1.Schema.Types.ObjectId, ref: "Organization" },
    documentLinks: [String],
    mobilePhone: {
        type: String,
        unique: true,
        validate: validator_1.default.isMobilePhone,
    },
    isPristine: {
        type: Boolean,
        default: true
    },
    arhived: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    autoIndex: true,
    strict: false,
});
exports.LeadSchema.index({
    firstName: "text",
    lastName: "text",
    address: "text",
    fullName: "text",
    email: "text",
    companyName: "text"
});
exports.LeadSchema.index({ campaignId: 1, mobilePhone: 1 }, { unique: true });
//# sourceMappingURL=lead.schema.js.map