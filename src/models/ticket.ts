import mongoose from "mongoose";
import { reassignmentSchema } from "./shared";

const ticketSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    createdBy: mongoose.Schema.Types.ObjectId, //handler
    assignedTo: String,
    leadId: String,
    customer: {
        id: String,
        name: String,
        phoneNumber: String,
        phoneNumberPrefix: String,
        email: String,
    },
    ticketId: mongoose.Schema.Types.ObjectId,
    review: String, //positive or negative [should use enum here]
    isReferral: Boolean,
    archived: { type: Boolean, default: false }, //push archive leads to s3
    expiresOn: Date,
    changeHistory: {changeType: String, by: String,to: String},
    notes: String,
    followUpDate: Date,
    status: String,   //lead status, like created, interacted, closed, cancelled etc
    source: String,  // excel uploads, web form etc
    isDeleted: { type: Boolean, default: false } // we will never delete it just mark it deleted and will fetch the values from a view which will already have these filters applied
}, {
    timestamps: true,
    autoIndex: true
});

export default mongoose.model("ticket", ticketSchema);