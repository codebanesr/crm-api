export declare enum SortOrder {
    ASC = "ASC",
    DESC = "DESC"
}
declare class Pagination {
    page: number;
    perPage: number;
    sortBy: string;
    sortOrder?: SortOrder;
}
declare class TransactionFilter {
    startDate: Date;
    endDate: Date;
    handler: string[];
    prospectName: string;
    campaign: string;
}
export declare class GetTransactionDto {
    pagination: Pagination;
    filters?: TransactionFilter;
}
export {};
