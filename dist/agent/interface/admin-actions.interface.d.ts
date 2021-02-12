import { Document } from "mongoose";
export interface AdminAction extends Document {
    userid: string;
    campaign: string;
    actionType: string;
    filePath: string;
    savedOn: string;
    fileType: string;
    organization: string;
    label?: string;
}
