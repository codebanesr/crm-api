"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadHistory = void 0;
const mongoose_1 = require("mongoose");
exports.LeadHistory = new mongoose_1.Schema({
    oldUser: String,
    newUser: String,
    lead: { type: mongoose_1.Schema.Types.ObjectId, ref: "Lead", required: true },
    notes: String,
    callRecordUrl: String,
    geoLocation: {
        coordinates: [Number],
    },
    leadStatus: String,
    attachment: String,
    phoneNumber: String,
    createdAt: { type: Date, default: new Date() },
    requestedInformation: Object,
});
//# sourceMappingURL=lead-history.schema.js.map