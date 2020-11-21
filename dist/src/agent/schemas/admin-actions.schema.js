"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminActionSchema = void 0;
const mongoose_1 = require("mongoose");
exports.AdminActionSchema = new mongoose_1.Schema({
    userid: mongoose_1.Schema.Types.ObjectId,
    actionType: String,
    filePath: String,
    savedOn: String,
    fileType: String,
    organization: { type: mongoose_1.Types.ObjectId, ref: "Organization" },
}, { timestamps: true });
//# sourceMappingURL=admin-actions.schema.js.map