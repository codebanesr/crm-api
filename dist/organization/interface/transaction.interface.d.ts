import { Document } from "mongoose";
export interface Transaction extends Document {
    organization: string;
    discount: number;
    expiresOn: Date;
    perUserRate: number;
    seats: number;
    total: number;
}
