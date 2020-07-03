"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AttachmentSchema = new mongoose_1.default.Schema({
    _id: mongoose_1.default.Schema.Types.ObjectId,
    filename: { type: String, required: true },
    path: { type: String, required: true }
});
exports.default = mongoose_1.default.model("Attachment", AttachmentSchema);
//# sourceMappingURL=attachments.js.map