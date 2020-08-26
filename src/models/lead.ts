import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  externalId: { type: String, required: true },
  history: { type: Array, default: [] },
  email: {
    type: String, required: true
  },
  campaign: String,
  firstName: String,
  lastName: String,
  source: String,
  amount: String,
  customerEmail: String,
  phoneNumberPrefix: String,
  phoneNumber: String,
  additionalPhoneNumber: [String],
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
}, {
  timestamps: true,
  autoIndex: true,
  strict: false
});

leadSchema.index({"$**": "text"});
export default mongoose.model("Lead", leadSchema);