import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    leadId:  {type: String, required: [true, 'leadId is a must']},
    email:  {type: String, required: [true, 'Email is required!']},
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