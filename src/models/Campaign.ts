import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
    campaignName: {type: String, required: true},
    worklow: String,
    comment: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    interval: [Date],
    type: { type: String }
},{ timestamps: true});

export default mongoose.model("Campaign", campaignSchema);