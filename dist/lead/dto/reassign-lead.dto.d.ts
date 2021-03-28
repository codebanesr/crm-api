export declare class LeadDto {
    externalId: string;
}
export declare class ReassignLeadDto {
    oldUserEmail: string;
    newUserEmail: string;
    lead: LeadDto;
}
