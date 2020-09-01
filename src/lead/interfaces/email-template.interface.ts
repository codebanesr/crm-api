import { Document } from "mongoose";

export interface EmailTemplate extends Document {
    campaigns: string,
    email: string,
    content: string,
    subject: string,
    attachments: attachment[]
}

interface attachment {
    filePath: string,
    fileName: string
}