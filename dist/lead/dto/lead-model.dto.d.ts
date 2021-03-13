import { GeoLocation } from "../interfaces/geo-location.interface";
export declare class Lead {
    externalId?: string;
    email?: string;
    campaign: string;
    firstName: string;
    lastName: string;
    source: string;
    fullName: string;
    amount: number;
    customerEmail: string;
    phoneNumberPrefix?: string;
    mobilePhone: string;
    leadStatus: string;
    address: string;
    followUp: Date;
    companyName: string;
    remarks: string;
    product: string;
    geoLocation: GeoLocation;
    bucket: string;
    operationalArea: string;
    pincode: number;
    nextAction?: string;
    documentLinks?: string[];
}
