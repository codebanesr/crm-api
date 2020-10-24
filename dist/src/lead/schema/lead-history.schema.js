"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadHistorySchema = void 0;
const mongoose_1 = require("mongoose");
exports.LeadHistorySchema = new mongoose_1.Schema({
    altContact: [String],
    lastDisposition: String,
}, {
    timestamps: true,
});
//# sourceMappingURL=lead-history.schema.js.map