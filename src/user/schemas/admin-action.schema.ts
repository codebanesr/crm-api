import { Schema } from "mongoose";

export const AdminActionSchema = new Schema(
  {
    userid: { type: Schema.Types.ObjectId, ref: "User" },
    organization: { type: Schema.Types.ObjectId, ref: "Organization" },
    campaign: {type: Schema.Types.ObjectId, ref: "Campaign"},
    actionType: String,
    filePath: String,
    savedOn: {
      type: String,
      enum: ["disk", "s3"],
    },
    fileType: String,
    label: String,
  },
  { timestamps: true }
);
