import mongoose from "mongoose";
import {STATUS, STAGE, TRANSITIONS} from "../types/leadMetadata";


// add a lead priority index [An enum variable with list of priorities]
const leadSchema = new mongoose.Schema({
    _id: String,
    email: {
      type: String
    },
    nickname: {
      type: String
    },
    phoneNumberPrefix: {
      type: Date
    },
    phoneNumber: {
      type: String
    },
    amount: {
      type: Number
    },
    followUp: {
      type: Date
    },
    agree: {
      type: Boolean
    },
    status: {
      type: String
    }
  }, {
    timestamps: true,
    autoIndex: true
});

export default mongoose.model("Lead", leadSchema);