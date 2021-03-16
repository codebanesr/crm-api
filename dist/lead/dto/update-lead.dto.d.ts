import { Lead } from "./lead-model.dto";
declare class GeoLocation {
    coordinates: number[];
}
declare class CallRecord {
    number: string;
    duration: number;
    type: number;
    callStatus: string;
}
export declare class UpdateLead extends Lead {
    mobilePhone: string;
    notes?: string;
}
export declare class UpdateLeadDto {
    lead: UpdateLead;
    geoLocation: GeoLocation;
    reassignToUser?: string;
    emailForm: {
        attachments: {
            filePath: string;
            fileName: string;
        };
        content: string;
        subject: string;
        overwriteEmail: string;
    };
    campaignId: string;
    requestedInformation?: {
        [key: string]: string;
    }[];
    callRecord?: CallRecord;
}
export {};
