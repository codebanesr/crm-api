import * as mongoose from 'mongoose';
import { OrganizationalType } from '../../utils/organizational.enum';

export const OrganizationSchema = new mongoose.Schema ({
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
        enum : Object.keys(OrganizationalType),
        default: OrganizationalType.TRIAL
    }
}, {
    versionKey: false,
    timestamps: true,
});