import mongoose from "mongoose";

const emailTemplateSchema = new mongoose.Schema({
    campaigns: String,
    email: { type: String },
    content: { type: String, required: true },
    subject: { type: String, required: true },
    attachments: [{
        filePath: String,
        fileName: String
    }]
}, {
  timestamps: true,
  autoIndex: true,
  strict: false
});

emailTemplateSchema.index({"$**": "text"});
export default mongoose.model("emailTemplate", emailTemplateSchema);