import { Schema, Types } from "mongoose";

export const CampaignSchema = new Schema(
  {
    campaignName: { type: String, required: true },
    worklow: String,
    comment: String,
    organization: { type: Types.ObjectId, ref: "Organization" },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    archived: Boolean,
    startDate: Date,
    endDate: Date,
    assignees: [{ type: Types.ObjectId, ref: "User" }],
    type: { type: String },
    browsableCols: [String],
    uniqueCols: [String],
    editableCols: [String],
    assignTo: [String],
    advancedSettings: [String],
    formModel: Object,
    autodialSettings: Object,
    groups: [
      {
        label: String,
        value: [String],
      },
    ],
  },
  { timestamps: true }
);
