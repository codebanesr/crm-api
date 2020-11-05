import { Schema } from "mongoose";

export const AdminActionSchema = new Schema(
  {
    userid: Schema.Types.ObjectId,
    actionType: String,
    filePath: String,
    savedOn: {
      type: String,
      enum: ["disk", "s3"],
    },
    fileType: String,
  },
  { timestamps: true }
);
