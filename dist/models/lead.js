"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const leadSchema = new mongoose_1.default.Schema({
    externalId: { type: String, required: true },
    history: { type: Array, default: [] },
    email: {
        type: String, required: true
    },
    campaign: String,
    firstName: String,
    lastName: String,
    source: String,
    amount: String,
    customerEmail: String,
    phoneNumberPrefix: String,
    phoneNumber: String,
    additionalPhoneNumber: [String],
    leadStatus: String,
    address: String,
    followUp: Date,
    companyName: String,
    remarks: String,
    product: String,
    geoLocation: String,
    bucket: String,
    operationalArea: String,
    pincode: Number,
}, {
    timestamps: true,
    autoIndex: true,
    strict: false
});
leadSchema.index({ "$**": "text" });
exports.default = mongoose_1.default.model("Lead", leadSchema);
//# sourceMappingURL=lead.js.map