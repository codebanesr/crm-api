import { Document } from "mongoose";
export interface AdminAction extends Document {
    userid: string;
    actionType: string;
    fileType: string;
    savedOn: string;
    filePath: string;
}
