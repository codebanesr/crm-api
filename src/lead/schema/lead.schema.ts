import { Schema } from "mongoose";
import { LeadHistory } from "./lead-history.schema";

export const LeadSchema = new Schema(
  {
    externalId: { type: String },
    email: String,
    contact: [
      {
        label: String,
        value: String,
        category: String,
      },
    ],
    campaign: String,
    /** @Todo set this to required type after upload and addLead are fixed to store campaignIds as well, all campaignName code should
     * be replaced to use this
     */
    campaignId: {type: Schema.Types.ObjectId, ref: "Campaign"},
    firstName: String,
    lastName: String,
    source: String,
    amount: Number,
    leadStatus: String,
    address: String,
    followUp: Date,
    companyName: String,
    state: String,
    pincode: Number,
    nextAction: String,
    organization: { type: Schema.Types.ObjectId, ref: "Organization" },
  },
  {
    timestamps: true,
    autoIndex: true,
    strict: false,
  }
);

/** @Todo Remove the text indexing from here */
LeadSchema.index({ "$**": "text" });
