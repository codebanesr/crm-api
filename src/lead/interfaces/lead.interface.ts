import { Schema, Document } from "mongoose";

export interface Lead extends Document {
  email?: string;
  externalId?: string;
  campaign: string;
  campaignId?: string;
  firstName?: string;
  lastName?: string;
  fullName?:string;
  source?: string;
  amount?: number;
  leadStatus?: string;
  address?: string;
  state?: string;
  followUp?: Date;
  companyName?: string;
  pincode?: number;
  organization?: string;
  nextAction?: string;
  contact?: { label: String; value: String; category: String }[];
  requestedInformation?: { [key: string]: string }[];
  documentLinks?: string[],
  isPristine?: boolean
}
