import { AssignmentEnum } from "../enum/generic.enum";
export declare class FiltersDto {
    showArchived?: boolean;
    showClosed?: boolean;
    assigned: AssignmentEnum;
    dateRange: string[];
    selectedCampaign: string;
    leadStatusKeys: string[];
    handlers: string[];
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
