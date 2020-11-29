"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadHistory = void 0;
const mongoose_1 = require("mongoose");
exports.LeadHistory = new mongoose_1.Schema({
    oldUser: String,
    newUser: String,
    lead: { type: mongoose_1.Schema.Types.ObjectId, ref: "Lead", required: true },
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
});
//# sourceMappingURL=lead-history.schema.js.map