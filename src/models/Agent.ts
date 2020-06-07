import mongoose from "mongoose";

const AgentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    email: { type: String, required: true },
    roleType: { type: String, required: true },
    userGroups: { type: String },
    passwordExpires: { type: Date },
    image: String,
    password: String, //hashed
    phonenumber: String
});

export default mongoose.model("Agent", AgentSchema);