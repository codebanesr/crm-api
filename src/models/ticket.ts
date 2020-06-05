import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    leadId:  String,
    email:  String,
    assignedTo: String,
    nickname: String,
    phoneNumberPrefix: Date,
    phoneNumber: String,
    review: String,
    followUp: Date,
    agree:  Boolean,
    status: String
  }, {
    timestamps: true,
    autoIndex: true
});

export default mongoose.model("Ticket", ticketSchema);