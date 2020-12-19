import { Schema } from "mongoose";

export const LeadHistory = new Schema({
  /** Old user and new user should be object ids */
  oldUser: String,
  newUser: String,
  lead: { type: Schema.Types.ObjectId, ref: "Lead", required: true },

  /** @Todo this field should eventually be made required. This will be required for applying filters from transaction filters */
  campaign: {type: Schema.Types.ObjectId, ref: "Campaign"},
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
  nextAction: String,
  organization: {type: Schema.Types.ObjectId, ref:"Organization"},
  documentLinks: [String]
});
