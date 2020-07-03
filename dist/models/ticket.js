"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ticketSchema = new mongoose_1.default.Schema({
    leadId: { type: String, required: [true, 'leadId is a must'] },
    email: { type: String, required: [true, 'Email is required!'] },
    assignedTo: String,
    nickname: String,
    phoneNumberPrefix: Date,
    phoneNumber: String,
    review: String,
    followUp: Date,
    agree: Boolean,
    status: String
}, {
    timestamps: true,
    autoIndex: true
});
exports.default = mongoose_1.default.model("Ticket", ticketSchema);
//# sourceMappingURL=ticket.js.map