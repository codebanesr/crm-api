import mongoose from "mongoose";

const AttachmentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    filename: { type: String, required: true },
    path: { type: String, required: true }
});

export default mongoose.model("Attachment", AttachmentSchema);