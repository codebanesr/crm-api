"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlarmSchema = void 0;
const mongoose_1 = require("mongoose");
exports.AlarmSchema = new mongoose_1.Schema({
    deleted: { type: Boolean, default: false },
    module: { type: String, required: true },
    moduleId: { type: String, required: true },
    tag: String,
    severity: String,
    userEmail: { type: String, required: true },
    seen: { type: Boolean, default: false },
    message: { type: String }
}, { timestamps: true });
//# sourceMappingURL=alarm.schema.js.map