import { Schema, Types } from "mongoose";

export const CampaignConfigSchema = new Schema({
    name: String,
    internalField: String,
    readableField: String,
    type: String,
    options: [String],
    checked: Boolean,
    organization: {
        type: Types.ObjectId,
        ref: 'Organization'
    }
});