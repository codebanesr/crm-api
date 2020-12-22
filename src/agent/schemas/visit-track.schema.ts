import { Schema } from "mongoose";

export const VisitTrackSchema = new Schema({
    userId: String,

    batteryStatus: Number,


    isGpsEnabled: Boolean,

    locations: [{
        lat: Number,
        lng: Number,
        timestamp: Date
    }]
}, {timestamps: true});