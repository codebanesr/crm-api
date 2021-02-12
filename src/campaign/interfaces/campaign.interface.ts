import { Document } from "mongoose";

export interface Campaign extends Document {
  campaignName: string;
  workflow: string;
  comment: string;
  createdBy: string;
  startDate: Date;
  endDate: Date;
  type: string;
  organization: string;
  assignees: string[];
  editableCols: string[];
  browsableCols: string[];
  uniqueCols: string[];
  formModel: any;
  advancedSettings: string[];
  archived: boolean;
  assignTo: string[];
  autodialSettings: Object;
  groups: {
    label: string;
    value: string[];
  };
}
