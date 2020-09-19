import { Schema, Types } from "mongoose";

export const EmailTemplateSchema = new Schema(
  {
    campaigns: String,
    email: { type: String },
    content: { type: String, required: true },
    subject: { type: String, required: true },
    organization: { type: Types.ObjectId, ref: "Organization" },
    attachments: [
      {
        filePath: String,
        fileName: String,
      },
    ],
  },
  {
    timestamps: true,
    autoIndex: true,
    strict: false,
  }
);

EmailTemplateSchema.index({ "$**": "text" });
