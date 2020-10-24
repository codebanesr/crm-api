import { Mongoose, Schema } from "mongoose";

export const LeadSchema = new Schema(
  {
    externalId: { type: String, required: true },
    history: [
      {
        type: new Schema(
          {
            oldUser: String,
            newUser: String,
            note: String,
            callRecordUrl: String,
            location: { lat: String, lon: String },
            callStatus: String,
            attachment: String,
          },
          { timestamps: { createdAt: true, updatedAt: false } }
        ),
      },
    ],
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
