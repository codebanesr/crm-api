import { Lead } from "./lead-model.dto";
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
export declare class UpdateLead extends Lead {
    mobilePhone: string;
}
export declare class UpdateLeadDto {
    lead: UpdateLead;
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
