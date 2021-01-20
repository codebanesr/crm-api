"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RulesSchema = void 0;
const mongoose_1 = require("mongoose");
const rules_constants_1 = require("./rules.constants");
exports.RulesSchema = new mongoose_1.Schema({
    campaign: { type: mongoose_1.Types.ObjectId, ref: "Campaign" },
    action: { type: String, enum: Object.values(rules_constants_1.EActions) },
    changeHandler: String,
    daysOverdue: Number,
    disposition: String,
    fromDisposition: String,
    newDisposition: String,
    newHandler: String,
    numberOfAttempts: Number,
    toDisposition: String,
    trigger: { type: String, enum: Object.values(rules_constants_1.Trigger) },
    url: String,
    isActive: Boolean
}, { timestamps: true });
//# sourceMappingURL=rules.schema.js.map