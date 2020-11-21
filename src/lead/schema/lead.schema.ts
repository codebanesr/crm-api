import { Mongoose, Schema } from "mongoose";

export const LeadSchema = new Schema(
  {
    externalId: { type: String, required: true },
    email: String,
    history: [
      {
        oldUser: String,
        newUser: String,
        note: String,
        callRecordUrl: String,
        geoLocation: {
          coordinates: [Number],
        },
        leadStatus: String,
        attachment: String,
        phoneNumber: String,
        createdAt: { type: Date, default: new Date() },
        requestedInformation: Object,
      },
    ],
    contact: [
      {
        label: String,
        value: String,
        type: String,
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
