import { IsEnum } from 'class-validator';
import * as mongoose from 'mongoose';
import { OrganizationalType } from 'src/utils/organizational.enum';

export const OrganizationSchema = new mongoose.Schema ({
    name: {
        type: String,
        minlength: 6,
        maxlength: 255,
        required: [true, 'NAME_IS_BLANK'],
    },
    accountType: {
        type: String,
        enum : Object.keys(OrganizationalType),
        default: OrganizationalType.TRIAL
    },
    lastActive: {
        type: Date,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true,
});