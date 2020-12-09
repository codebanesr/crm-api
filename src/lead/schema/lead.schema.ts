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
    firstName: String,
    lastName: String,
    source: String,
    amount: Number,
    leadStatus: String,
    address: String,
    followUp: Date,
    companyName: String,
    remarks: String,
    product: String,
    bucket: String,
    operationalArea: String,
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

/** Remove the text indexing from here */
LeadSchema.index({ "$**": "text" });
