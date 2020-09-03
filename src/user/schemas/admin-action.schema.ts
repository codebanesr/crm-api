import { Schema } from "mongoose";

export const AdminActionSchema = new Schema({
    userid: Schema.Types.ObjectId,
    actionType: String,
    filePath: String,
    savedOn: String,
    fileType: String,
}, { timestamps: true });