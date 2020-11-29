import { Schema } from "mongoose";

export const LeadHistory = new Schema({
  /** Old user and new user should be object ids */
  oldUser: String,
  newUser: String,
  lead: { type: Schema.Types.ObjectId, ref: "Lead", required: true },
  campaignName: String,
  prospectName: String,
  phoneNumber: String,
  followUp: String,
  direction: String,
  notes: String,
  callRecordUrl: String,
  geoLocation: {
    coordinates: [Number],
  },
  leadStatus: String,
  attachment: String,
  createdAt: { type: Date, default: new Date() },
  requestedInformation: Object,
});
