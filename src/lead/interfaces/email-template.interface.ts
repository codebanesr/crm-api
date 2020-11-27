import { Document } from "mongoose";

export interface EmailTemplate extends Document {
  campaign: string;
  email: string;
  content: string;
  subject: string;
  attachments: attachment[];
  organization: string;
}

interface attachment {
  filePath: string;
  fileName: string;
}
