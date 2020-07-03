"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AdminActionSchema = new mongoose_1.default.Schema({
    userid: mongoose_1.default.Schema.Types.ObjectId,
    actionType: String,
    filePath: String,
    savedOn: String,
    fileType: String,
}, { timestamps: true });
exports.default = mongoose_1.default.model("adminAction", AdminActionSchema);
//# sourceMappingURL=AdminAction.js.map