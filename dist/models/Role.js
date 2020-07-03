"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// add a lead priority index [An enum variable with list of priorities]
const roleSchema = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model("Role", roleSchema);
//# sourceMappingURL=Role.js.map