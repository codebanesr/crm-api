import mongoose from "mongoose";

const CampaignConfigSchema = new mongoose.Schema({
    name: String,
    internalField: String,
    readableField: String,
    type: String,
    checked: Boolean
});

export default mongoose.model("CampaignConfig", CampaignConfigSchema);