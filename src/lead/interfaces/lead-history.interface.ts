import { Document } from "mongoose";

export interface LeadHistory extends Document {
  oldUser: string;
  newUser: string;
  lead: string;
  campaign: string;
  campaignName: string;
  prospectName: string;
  phoneNumber: string;
  followUp: String;
  direction: String;
  notes: string;
  callRecordUrl: string;
  geoLocation: leadHistoryGeoLocation;
  leadStatus: string;
  attachment: string;
  nextAction: string;
  requestedInformation?: { [key: string]: string }[];
  organization: string;
}

export class leadHistoryGeoLocation {
  coordinates: number[];
}
