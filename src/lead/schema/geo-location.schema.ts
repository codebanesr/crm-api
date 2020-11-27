import { Schema } from "mongoose";

// add a lead priority index [An enum variable with list of priorities]
export const GeoLocationSchema = new Schema(
  {
    userid: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
    },
    location: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
  },
  {
    timestamps: true,
  }
);

GeoLocationSchema.index({ loc: "2dsphere" });
