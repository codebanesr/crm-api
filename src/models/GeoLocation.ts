import mongoose from "mongoose";
// add a lead priority index [An enum variable with list of priorities]
const geoLocationSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: {type: [Number], default: [0, 0]}
    }
}, {
    timestamps: true
});

geoLocationSchema.index({ "loc": "2dsphere" });

export default mongoose.model("GeoLocation", geoLocationSchema);