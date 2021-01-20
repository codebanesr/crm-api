import { Document } from "mongoose";
import { EActions, Trigger } from "./rules.constants";

export interface Rules extends Document {
  action: EActions;
  changeHandler: string;
  daysOverdue: number;
  disposition: string;
  fromDisposition: string;
  newDisposition: string;
  newHandler: string;
  numberOfAttempts: number;
  toDisposition: string;
  trigger: Trigger;
  url: string;
  campaign: string
}
