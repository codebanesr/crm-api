"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationSchema = void 0;
const mongoose = require("mongoose");
const organizational_enum_1 = require("../../utils/organizational.enum");
exports.OrganizationSchema = new mongoose.Schema({
    organizationName: {
        type: String,
        minlength: 6,
        maxlength: 255,
        required: [true, 'NAME_IS_BLANK'],
    },
    email: {
        type: String,
        minlength: 6,
        maxlength: 255,
        required: [true, 'EMAIL_IS_BLANK'],
    },
    phoneNumber: {
        type: String,
        minlength: 8,
        maxlength: 14,
        required: [true, 'PHONE_NUMBER_IS_BLANK'],
    },
    phoneNumberPrefix: {
        type: String,
        minlength: 1,
        maxlength: 3,
        required: [true, 'PHONE_NUMBER_PREFIX_IS_BLANK'],
    },
    accountType: {
        type: String,
        enum: Object.keys(organizational_enum_1.OrganizationalType),
        default: organizational_enum_1.OrganizationalType.TRIAL
    }
}, {
    versionKey: false,
    timestamps: true,
});
//# sourceMappingURL=organization.schema.js.map