"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallLogSchema = void 0;
const mongoose_1 = require("mongoose");
exports.CallLogSchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    "date": Date,
    "number": String,
    "type": Number,
    "duration": Number,
    "new": Number,
    "cachedNumberType": Number,
    "phoneAccountId": String,
    "viaNumber": String,
    "name": String,
    "contact": String,
    "photo": String,
    "thumbPhoto": String,
    "organization": { type: mongoose_1.Types.ObjectId, ref: 'Organization' },
    "user": { type: mongoose_1.Types.ObjectId, ref: 'User' }
}, {
    strict: false
});
exports.CallLogSchema.index({ date: 1, number: 1 }, { unique: true });
//# sourceMappingURL=call-log.schema.js.map