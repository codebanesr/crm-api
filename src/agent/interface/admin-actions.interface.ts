import { Document } from "mongoose";

export interface AdminAction extends Document {
    userid: string,
    actionType: string,
    filePath: string,
    savedOn: string,
    fileType: string,
    organization: string
}