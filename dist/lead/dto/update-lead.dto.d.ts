declare class GeoLocation {
    coordinates: number[];
}
export declare class ReassignmentInfo {
    newUser: string;
}
declare class CallRecord {
    number: string;
    duration: number;
    type: number;
    callStatus: string;
}
export declare class Lead {
    externalId?: string;
    email: string;
    campaign: string;
    firstName: string;
    lastName: string;
    source: string;
    fullName: string;
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
    nextAction?: string;
    documentLinks?: string[];
}
export declare class UpdateLeadDto {
    lead: Lead;
    geoLocation: GeoLocation;
    reassignmentInfo?: ReassignmentInfo;
    emailForm: {
        attachments: {
            filePath: string;
            fileName: string;
        };
        content: string;
        subject: string;
    };
    campaignId: string;
    requestedInformation?: {
        [key: string]: string;
    }[];
    callRecord?: CallRecord;
}
export {};
