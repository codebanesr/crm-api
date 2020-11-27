import { Document } from "mongoose";

export interface CampaignForm extends Document {
  campaign: string;
  organization: string;
  payload: JSON;
  createdAt?: Date;
  updatedAt?: Date;
}
