import { Schema, Document } from "mongoose";
import { LeadHistory } from "./lead-history.interface";

export interface Lead extends Document {
  email: string;
  externalId?: string;
  campaign: string;
  campaignId?: string;
  firstName: string;
  lastName: string;
  source: string;
  amount: number;
  leadStatus: string;
  address: string;
  followUp: Date;
  companyName: string;
  remarks: string;
  product: string;
  bucket: string;
  operationalArea: string;
  pincode: number;
  organization: string;
  nextAction?: string;
  contact: { label: String; value: String; category: String }[];
  requestedInformation?: { [key: string]: string }[];
}
