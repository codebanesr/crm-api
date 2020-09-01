import { Schema } from "mongoose";

export const AlarmSchema = new Schema({
    deleted: {type: Boolean, default: false},
    module : {type: String, required: true},
    moduleId: {type: String, required: true},
    tag: String,
    severity: String,
    userEmail: { type: String, required: true },
    seen: {type: Boolean, default: false},
    message: {type: String}
}, {timestamps: true});