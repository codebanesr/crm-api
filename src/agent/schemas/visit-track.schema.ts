import { Schema } from "mongoose";

export const VisitTrackSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: "User"},

    batLvl: Number,


    isGpsEnabled: Boolean,

    locations: [{
        lat: Number,
        lng: Number,
        timestamp: Date
    }]
}, {timestamps: true});