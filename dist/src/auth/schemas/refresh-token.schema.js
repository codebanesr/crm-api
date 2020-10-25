"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenSchema = void 0;
const mongoose_1 = require("mongoose");
exports.RefreshTokenSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    ip: {
        type: String,
        required: true,
    },
    browser: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
}, {
    versionKey: false,
    timestamps: true,
});
//# sourceMappingURL=refresh-token.schema.js.map