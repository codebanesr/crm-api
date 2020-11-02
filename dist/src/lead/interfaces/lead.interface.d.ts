import { Document } from "mongoose";
export interface Lead extends Document {
    externalId: string;
    history: LeadHistory[];
    email: string;
    campaign: string;
    firstName: string;
    lastName: string;
    source: string;
    amount: number;
    customerEmail: string;
    phoneNumberPrefix: string;
    phoneNumber: string;
    leadStatus: string;
    address: string;
    followUp: Date;
    companyName: string;
    remarks: string;
    product: string;
    bucket: string;
    operationalArea: string;
    pincode: number;
    organization: string;
    requestedInformation?: {
        [key: string]: string;
    }[];
}
export interface LeadHistory {
    oldUser: string;
    newUser: string;
    note: string;
    callRecordUrl: string;
    geoLocation: leadHistoryGeoLocation;
    leadStatus: string;
    attachment: string;
    phoneNumber: string;
    requestedInformation?: {
        [key: string]: string;
    }[];
}
export declare class leadHistoryGeoLocation {
    coordinates: number[];
}
