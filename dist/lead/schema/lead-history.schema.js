"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadHistory = void 0;
const mongoose_1 = require("mongoose");
exports.LeadHistory = new mongoose_1.Schema({
    oldUser: String,
    newUser: String,
    lead: { type: mongoose_1.Schema.Types.ObjectId, ref: "Lead", required: true },
    campaign: { type: mongoose_1.Schema.Types.ObjectId, ref: "Campaign" },
    campaignName: String,
    prospectName: String,
    phoneNumber: String,
    followUp: String,
    direction: String,
    notes: String,
    callRecordUrl: String,
    geoLocation: {
        coordinates: [Number],
    },
    leadStatus: String,
    attachment: String,
    createdAt: { type: Date, default: new Date() },
    requestedInformation: Object,
    nextAction: String,
    organization: { type: mongoose_1.Schema.Types.ObjectId, ref: "Organization" },
    documentLinks: [String],
    number: { type: String, default: '' },
    duration: { type: Number, default: 0 },
    type: Number,
    callStatus: String
});
//# sourceMappingURL=lead-history.schema.js.map