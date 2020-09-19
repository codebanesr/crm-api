import { Schema, Types } from "mongoose";


export const CallLogSchema = new Schema({
    _id: Schema.Types.ObjectId,
    "date" : Date,
    "number" : String,
    "type" : Number,
    "duration" : Number,
    "new" : Number,
    "cachedNumberType" : Number,
    "phoneAccountId" : String,
    "viaNumber" : String,
    "name" : String,
    "contact" : String,
    "photo" : String,
    "thumbPhoto" : String,
    "organization": {type: Types.ObjectId, ref: 'Organization'},
    "user": {type: Types.ObjectId, ref: 'User'}
}, {
    strict: false
});


CallLogSchema.index({date:1, number:1}, { unique: true });