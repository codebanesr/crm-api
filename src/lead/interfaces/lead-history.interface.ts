import { Document } from "mongoose";

export interface LeadHistory extends Document {
  oldUser: string;
  newUser: string;
  lead: String;
  note: string;
  callRecordUrl: string;
  geoLocation: leadHistoryGeoLocation;
  leadStatus: string;
  attachment: string;
  phoneNumber: string;
  requestedInformation?: { [key: string]: string }[];
}

export class leadHistoryGeoLocation {
  coordinates: number[];
}
