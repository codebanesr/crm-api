"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AgentSchema = new mongoose_1.default.Schema({
    _id: mongoose_1.default.Schema.Types.ObjectId,
    name: { type: String, required: true },
    email: { type: String, required: true },
    roleType: { type: String, required: true },
    userGroups: { type: String },
    passwordExpires: { type: Date },
    image: String,
    password: String,
    phonenumber: String
});
exports.default = mongoose_1.default.model("Agent", AgentSchema);
//# sourceMappingURL=Agent.js.map