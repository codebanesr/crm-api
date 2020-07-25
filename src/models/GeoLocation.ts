import mongoose from "mongoose";
// add a lead priority index [An enum variable with list of priorities]
const geoLocationSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    loc: {
        type: { type: String },
        coordinates: [Number],
    }
}, {
    timestamps: true
});

geoLocationSchema.index({ "loc": "2dsphere" });

export default mongoose.model("GeoLocation", geoLocationSchema);