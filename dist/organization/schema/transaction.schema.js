"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionSchema = void 0;
const mongoose_1 = require("mongoose");
exports.TransactionSchema = new mongoose_1.Schema({
    organization: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    discount: { type: Number, default: 0 },
    expiresOn: { type: Date, required: true },
    perUserRate: { type: Number, required: true },
    seats: { type: Number, required: true },
    total: { type: Number, required: true }
});
//# sourceMappingURL=transaction.schema.js.map