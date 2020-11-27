import { Document } from "mongoose";
export interface CallLog extends Document {
    "date": string;
    "number": string;
    "type": number;
    "duration": number;
    "new": number;
    "cachedNumberType": number;
    "phoneAccountId": string;
    "viaNumber": string;
    "name": string;
    "contact": string;
    "photo": string;
    "thumbPhoto": string;
    "organization": string;
    "user": string;
}
