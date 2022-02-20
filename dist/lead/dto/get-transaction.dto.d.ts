import "reflect-metadata";
export declare enum SortOrder {
    ASC = "ASC",
    DESC = "DESC"
}
export declare class GetTransactionDto {
    page: number;
    perPage: number;
    sortBy: string;
    sortOrder?: SortOrder;
    startDate: Date;
    endDate: Date;
    handler: string[];
    prospectName: string;
    campaign: string;
    leadId: string;
    isStreamable: boolean;
}
