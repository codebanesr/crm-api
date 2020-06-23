import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  history: { type: Array, default: [] },
  email: {
    type: String, required: true
  },
  firstName: String,
  lastName: String,
  source: String,
  amount: Number,
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
  pincode: Number
}, {
  timestamps: true,
  autoIndex: true
});

leadSchema.index({"$**": "text"});
export default mongoose.model("Lead", leadSchema);