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
export declare class GetTransactionDto {
    pagination: Pagination;
    filters: any;
}
export {};
