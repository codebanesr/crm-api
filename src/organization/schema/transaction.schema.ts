
import { Schema } from "mongoose";

export const TransactionSchema = new Schema({
    organization: {type: Schema.Types.ObjectId, required: true},
    discount: {type: Number, default: 0},
    expiresOn: {type: Date, required: true},
    perUserRate: {type: Number, required: true},
    seats: {type: Number, required: true},
    total: {type: Number, required: true}
})