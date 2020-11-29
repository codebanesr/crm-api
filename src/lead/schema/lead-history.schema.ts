import { Schema } from "mongoose";

export const LeadHistory = new Schema({
  /** Old user and new user should be object ids */
  oldUser: { type: Schema.Types.ObjectId, ref: "User" },
  newUser: { type: Schema.Types.ObjectId, ref: "User" },
  lead: { type: Schema.Types.ObjectId, ref: "Lead", required: true },
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
});
