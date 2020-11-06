"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminActionSchema = void 0;
const mongoose_1 = require("mongoose");
exports.AdminActionSchema = new mongoose_1.Schema({
    userid: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    organization: { type: mongoose_1.Schema.Types.ObjectId, ref: "Organization" },
    actionType: String,
    filePath: String,
    savedOn: {
        type: String,
        enum: ["disk", "s3"],
    },
    fileType: String,
}, { timestamps: true });
//# sourceMappingURL=admin-action.schema.js.map