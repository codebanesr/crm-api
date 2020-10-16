import { Document } from "mongoose";
export interface Campaign extends Document {
    campaignName: string;
    workflow: string;
    comment: string;
    createdBy: string;
    interval: string[];
    type: string;
    organization: string;
}
