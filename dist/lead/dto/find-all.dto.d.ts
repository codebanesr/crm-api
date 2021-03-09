export declare class FiltersDto {
    showArchived?: false;
    assigned: true;
    dateRange: string[];
    selectedCampaign: string;
    leadStatusKeys: string[];
}
export declare class FindAllDto {
    readonly page: number;
    readonly perPage: number;
    readonly sortBy: string;
    readonly showCols: string[];
    readonly searchTerm: string;
    readonly filters?: FiltersDto;
    readonly typeDict?: any;
    campaignId: string;
}
