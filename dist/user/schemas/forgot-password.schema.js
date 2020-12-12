"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordSchema = void 0;
const mongoose_1 = require("mongoose");
const validator_1 = require("validator");
exports.ForgotPasswordSchema = new mongoose_1.Schema({
    email: {
        required: [true, 'EMAIL_IS_BLANK'],
        type: String,
        requierd: true,
    },
    verification: {
        type: String,
        validate: validator_1.default.isUUID,
        requierd: true,
    },
    firstUsed: {
        type: Boolean,
        default: false,
    },
    finalUsed: {
        type: Boolean,
        default: false,
    },
    expires: {
        type: Date,
        requierd: true,
    },
    ip: {
        type: String,
        requierd: true,
    },
    browser: {
        type: String,
        requierd: true,
    },
    country: {
        type: String,
        requierd: true,
    },
    ipChanged: {
        type: String,
    },
    browserChanged: {
        type: String,
    },
    countryChanged: {
        type: String,
    },
}, {
    versionKey: false,
    timestamps: true,
});
//# sourceMappingURL=forgot-password.schema.js.map