"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const campaignSchema = new mongoose_1.default.Schema({
    campaignName: { type: String, required: true },
    worklow: String,
    comment: String,
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    interval: [Date],
    type: { type: String }
}, { timestamps: true });
exports.default = mongoose_1.default.model("Campaign", campaignSchema);
//# sourceMappingURL=Campaign.js.map