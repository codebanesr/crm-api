"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// add a lead priority index [An enum variable with list of priorities]
const permissionSchema = new mongoose_1.default.Schema({
    label: { type: String, required: true },
    value: { type: String, required: true },
    checked: { type: Boolean, required: true }
}, {
    timestamps: true,
    autoIndex: true
});
exports.default = mongoose_1.default.model("Permission", permissionSchema);
//# sourceMappingURL=permission.js.map