import { Document } from "mongoose";
export interface Lead extends Document {
    email: string;
    externalId: string;
    history: LeadHistory[];
    campaign: string;
    firstName: string;
    lastName: string;
    source: string;
    amount: number;
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
    contact: {
        label: String;
        value: String;
    }[];
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
