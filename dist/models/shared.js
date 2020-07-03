"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.reassignmentSchema = new mongoose_1.default.Schema({
    from: String,
    to: String,
    content: String
});
//# sourceMappingURL=shared.js.map