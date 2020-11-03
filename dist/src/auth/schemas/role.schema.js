"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleSchema = void 0;
const mongoose_1 = require("mongoose");
exports.RoleSchema = new mongoose_1.Schema({
    _id: { type: String, required: true },
    value: String,
    label: String,
    permissions: [
        {
            label: String,
            value: String,
            checked: Boolean
        }
    ]
}, {
    timestamps: true,
    autoIndex: true
});
//# sourceMappingURL=role.schema.js.map