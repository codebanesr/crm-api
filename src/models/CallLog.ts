import mongoose from "mongoose";

const CallLog = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    "date" : Date,
    "number" : String,
    "type" : Number,
    "duration" : Number,
    "new" : Number,
    "cachedNumberType" : Number,
    "phoneAccountId" : String,
    "viaNumber" : String,
    "name" : String,
    "contact" : String,
    "photo" : String,
    "thumbPhoto" : String,
}, {
    strict: false
});


CallLog.index({date:1, number:1}, { unique: true });

export default mongoose.model("CallLog", CallLog);