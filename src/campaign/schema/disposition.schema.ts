import { Schema, Types } from "mongoose";

export const DispositionSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    campaign: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
    },

    organization: { type: Types.ObjectId, ref: "Organization" },
    options: [
      {
        title: String,
        key: String,
        expanded: Boolean,
        children: [
          {
            title: String,
            key: String,
            isLeaf: Boolean,
            children: [{}],
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
    autoIndex: true,
    strict: false,
  }
);
