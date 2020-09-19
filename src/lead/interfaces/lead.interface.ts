import { Schema, Document } from "mongoose";

export interface Lead extends Document {
    externalId: string,
    history: any[],
    email: string,
    campaign: string,
    firstName: string,
    lastName: string,
    source: string,
    amount: string,
    customerEmail: string,
    phoneNumberPrefix: string,
    phoneNumber: string,
    leadStatus: string,
    address: string,
    followUp: Date,
    companyName: string,
    remarks: string,
    product: string,
    geoLocation: string,
    bucket: string,
    operationalArea: string,
    pincode: number,
    organization: string
}