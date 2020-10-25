declare class GeoLocation {
    coordinates: number[];
}
export declare class ReassignmentInfo {
    oldUser: string;
    newUser: string;
}
export declare class Lead {
    externalId: string;
    email: string;
    campaign: string;
    firstName: string;
    lastName: string;
    source: string;
    amount: number;
    customerEmail: string;
    phoneNumberPrefix?: string;
    phoneNumber: string;
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
}
export declare class CreateLeadDto {
    lead: Lead;
    geoLocation: GeoLocation;
    reassignmentInfo?: ReassignmentInfo;
}
export {};
