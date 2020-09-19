import { Schema, Types } from "mongoose";

export const AdminActionSchema = new Schema(
  {
    userid: Schema.Types.ObjectId,
    actionType: String,
    filePath: String,
    savedOn: String,
    fileType: String,
    organization: { type: Types.ObjectId, ref: "Organization" },
  },
  { timestamps: true }
);
