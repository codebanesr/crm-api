"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplateSchema = void 0;
const mongoose_1 = require("mongoose");
exports.EmailTemplateSchema = new mongoose_1.Schema({
    campaigns: String,
    email: { type: String },
    content: { type: String, required: true },
    subject: { type: String, required: true },
    organization: { type: mongoose_1.Types.ObjectId, ref: "Organization" },
    attachments: [
        {
            filePath: String,
            fileName: String,
        },
    ],
}, {
    timestamps: true,
    autoIndex: true,
    strict: false,
});
exports.EmailTemplateSchema.index({ "$**": "text" });
//# sourceMappingURL=email-templates.schema.js.map