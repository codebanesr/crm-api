"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
;
const AlarmSchema = new mongoose_1.default.Schema({
    deleted: { type: Boolean, default: false },
    module: { type: String, required: true },
    moduleId: { type: String, required: true },
    tag: String,
    severity: String,
    userEmail: { type: String, required: true },
    seen: { type: Boolean, default: false },
    message: { type: String }
}, { timestamps: true });
exports.default = mongoose_1.default.model("Alarm", AlarmSchema);
//# sourceMappingURL=Alarm.js.map