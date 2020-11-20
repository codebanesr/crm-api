import { Document } from "mongoose";
export interface CampaignConfig extends Document {
    name: string;
    internalField: string;
    options: string[];
    readableField: string;
    type: string;
    checked: boolean;
    organization: string;
    group: string;
}
