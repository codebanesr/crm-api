import { Schema } from "mongoose";


export const ResellerOrganizationSchema = new Schema({
    orgName: String,
    orgId: String,
    resellerName: String,
    resellerId: String,
    credit: Number
}, {timestamps: true})