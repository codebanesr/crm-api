import { Schema, Types } from "mongoose";

export const CampaignFormSchema = new Schema(
  {
    campaign: { type: Types.ObjectId, ref: "Campaign" },
    organization: { type: Types.ObjectId, ref: "Organization" },
    payload: { type: Object, required: true },
  },
  { timestamps: true }
);
