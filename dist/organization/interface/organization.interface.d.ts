import { Document } from "mongoose";
import { OrganizationalType } from "../../utils/organizational.enum";
export interface Organization extends Document {
    name: string;
    accountType: OrganizationalType;
    phoneNumber: String;
    phoneNumberPrefix: string;
    email: string;
    lastActive: string;
}
