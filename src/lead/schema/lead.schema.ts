import { Schema } from "mongoose";

export const LeadSchema = new Schema(
  {
    externalId: { type: String, required: true },
    history: { type: Array, default: [] },
    email: {
      type: String,
      required: true,
    },
    campaign: String,
    firstName: String,
    lastName: String,
    source: String,
    amount: String,
    customerEmail: String,
    phoneNumberPrefix: String,
    phoneNumber: String,
    leadStatus: String,
    address: String,
    followUp: Date,
    companyName: String,
    remarks: String,
    product: String,
    geoLocation: String,
    bucket: String,
    operationalArea: String,
    pincode: Number,
    organization: { type: Schema.Types.ObjectId, ref: 'Organization' },
  },
  {
    timestamps: true,
    autoIndex: true,
    strict: false,
  }
);

LeadSchema.index({ "$**": "text" });
