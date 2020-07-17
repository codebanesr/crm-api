import mongoose from "mongoose";

const CallLog = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
}, {
    strict: false
});

export default mongoose.model("CallLog", CallLog);