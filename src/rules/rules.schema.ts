import { Schema, Types } from "mongoose";
import { EActions, Trigger } from "./rules.constants";

export const RulesSchema = new Schema(
  {
    campaign: {type: Types.ObjectId, ref: "Campaign"},
    action: {type: String, enum: Object.values(EActions)},
    changeHandler: String,
    daysOverdue: Number,
    disposition: String,
    fromDisposition: String,
    newDisposition: String,
    newHandler: String,
    numberOfAttempts: Number,
    toDisposition: String,
    trigger: {type: String, enum: Object.values(Trigger)},
    url: String,
    isActive: Boolean
  },
  { timestamps: true }
);
