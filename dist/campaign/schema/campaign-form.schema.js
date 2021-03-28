"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignFormSchema = void 0;
const mongoose_1 = require("mongoose");
exports.CampaignFormSchema = new mongoose_1.Schema({
    campaign: { type: mongoose_1.Types.ObjectId, ref: "Campaign" },
    organization: { type: mongoose_1.Types.ObjectId, ref: "Organization" },
    payload: { type: Object, required: true },
}, { timestamps: true });
//# sourceMappingURL=campaign-form.schema.js.map