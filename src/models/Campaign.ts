import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    worklow: String,
    handler: String,
    interval: Date,
    type: String
},{ timestamps: true});

export default mongoose.model("Campaign", campaignSchema);