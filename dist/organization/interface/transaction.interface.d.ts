import { Document } from "mongoose";
export interface Transaction extends Document {
    organization: number;
    discount: number;
    expiresOn: Date;
    perUserRate: number;
    seats: number;
    total: number;
}
