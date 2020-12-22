import { Schema } from "mongoose";

export const VisitTrackSchema = new Schema({
    userId: String,

    batLvl: Number,


    isGpsEnabled: Boolean,

    locations: [{
        lat: Number,
        lng: Number,
        timestamp: Date
    }]
}, {timestamps: true});