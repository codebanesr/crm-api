import mongoose from "mongoose";
import { STATUS, STAGE, TRANSITIONS } from "../types/leadMetadata";


// add a lead priority index [An enum variable with list of priorities]
const leadSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  email: {
    type: String, required: true
  },
  title: String,
  firstName: String,
  lastName: String,
  source: String,
  followUp: Date,
  lastVisited: Date,
  remarks: String,
  customerEmail: String,
  mobileNumber: String,
  address: String,
  companyName: String,
  product: String,
  geoLocation: String,
  bucket: String,
  agencyLocation: String,
  operationalArea: String,
  circle: String,
  district: String,
  pincode: String,
  workPhone: String,
  homePhone: String,
  state: String,
  city: String,
  leadStatus: String
}, {
  timestamps: true,
  autoIndex: true
});

leadSchema.index({'$**': 'text'});
export default mongoose.model("Lead", leadSchema);