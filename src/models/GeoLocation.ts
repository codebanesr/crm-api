import mongoose from "mongoose";
// add a lead priority index [An enum variable with list of priorities]
const geoLocationSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userid: mongoose.Schema.Types.ObjectId,
    loc: {
        type: { type: String },
        coordinates: [Number],
    }
});

geoLocationSchema.index({ "loc": "2dsphere" });

export default mongoose.model("GeoLocation", geoLocationSchema);