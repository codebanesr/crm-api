import { Schema } from "mongoose";

export const CampaignConfigSchema = new Schema({
  name: String,
  internalField: String,
  readableField: String,
  type: String,
  options: [String],
  checked: Boolean,
  // group: String,
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
  },
  campaignId: {
    type: Schema.Types.ObjectId,
    ref: "Campaign"
  }
});


CampaignConfigSchema.index({ campaignId: 1, internalField: 1 }, { unique: true });
