import mongoose from "mongoose";

const AdminActionSchema = new mongoose.Schema({
    userid: mongoose.Schema.Types.ObjectId,
    actionType: String,
    filePath: String,
    savedOn: String,
    fileType: String,
}, { timestamps: true });


export default mongoose.model("adminAction", AdminActionSchema);