"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadSchema = void 0;
const mongoose_1 = require("mongoose");
exports.LeadSchema = new mongoose_1.Schema({
    externalId: { type: String, required: true },
    email: String,
    history: [
        {
            oldUser: String,
            newUser: String,
            note: String,
            callRecordUrl: String,
            geoLocation: {
                coordinates: [Number],
            },
            leadStatus: String,
            attachment: String,
            phoneNumber: String,
            createdAt: { type: Date, default: new Date() },
            requestedInformation: Object,
        },
    ],
    contact: [
        {
            label: String,
            value: String,
            category: String,
        },
    ],
    campaign: String,
    firstName: String,
    lastName: String,
    source: String,
    amount: Number,
    leadStatus: String,
    address: String,
    followUp: Date,
    companyName: String,
    remarks: String,
    product: String,
    bucket: String,
    operationalArea: String,
    pincode: Number,
    organization: { type: mongoose_1.Schema.Types.ObjectId, ref: "Organization" },
}, {
    timestamps: true,
    autoIndex: true,
    strict: false,
});
exports.LeadSchema.index({ "$**": "text" });
//# sourceMappingURL=lead.schema.js.map