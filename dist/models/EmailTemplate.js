"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const emailTemplateSchema = new mongoose_1.default.Schema({
    campaigns: String,
    email: { type: String },
    content: { type: String, required: true },
    subject: { type: String, required: true },
    attachments: [{
            filePath: String,
            fileName: String
        }]
}, {
    timestamps: true,
    autoIndex: true,
    strict: false
});
emailTemplateSchema.index({ "$**": "text" });
exports.default = mongoose_1.default.model("emailTemplate", emailTemplateSchema);
//# sourceMappingURL=EmailTemplate.js.map