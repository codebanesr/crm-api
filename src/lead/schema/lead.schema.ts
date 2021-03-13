import { Schema } from "mongoose";
import validator from "validator";

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
    campaignId: {
      type: Schema.Types.ObjectId, 
      ref: "Campaign",
      required: true
    },

    firstName: String,
    lastName: String,
    fullName: String,
    source: String,
    amount: Number,
    leadStatus: String,
    address: String,
    followUp: Date,
    companyName: String,
    state: String,
    pincode: Number,
    nextAction: { type: String, default: null },
    organization: { type: Schema.Types.ObjectId, ref: "Organization" },
    documentLinks: [String],
    mobilePhone: {
      type: String,
      unique: true,
      validate: validator.isMobilePhone,
    },
    isPristine: {
      type: Boolean,
      default: true
    },
    arhived: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    autoIndex: true,
    strict: false,
  }
);

/** @Todo Remove the text indexing from here */
LeadSchema.index({ 
  firstName: "text", 
  lastName: "text", 
  address: "text", 
  fullName: "text", 
  email: "text", 
  companyName: "text" 
});

LeadSchema.index({campaignId: 1, mobilePhone: 1}, {unique: true});