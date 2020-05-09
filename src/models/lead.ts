import mongoose from "mongoose";
import { noteSchema } from "./shared";
import {STATUS, STAGE, TRANSITIONS} from "../types/leadMetadata";


// add a lead priority index [An enum variable with list of priorities]
const leadSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: String, //handler
    amount: Number,
    customer: {
        id: String,
        name: String,
        mobile: String,
        email: String,
    },
    isReferral: Boolean,
    archived: { type: Boolean, default: false }, //push archive leads to s3
    ticketId: String,
    expiresOn: Date,
    changeHistory: Array, //array of change history schema
    notes: [noteSchema],
    followUpDate: Date,
    status: {
        type: String,
        enum : [Object.values(STATUS)],
        default: "NEW"
    },   //lead status, like created, interacted, closed, cancelled etc
    stage: {
        type: String,
        enum : [Object.values(STAGE)],
        default: "NEW"
    },
    generatorId: String,
    userAgent: String,   // make it enum like userDevice, or web  - for analytics
    source: String,  // excel uploads, web form etc
    isDeleted: { type: Boolean, default: false } // we will never delete it just mark it deleted and will fetch the values from a view which will already have these filters applied
}, {
    timestamps: true,
    autoIndex: true
});

export default mongoose.model("Lead", leadSchema);