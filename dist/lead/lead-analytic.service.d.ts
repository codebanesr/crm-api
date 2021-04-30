import { Aggregate } from "mongoose";
import { GetGraphDataDto, GetGraphDataDto2 } from "./dto/get-graph-data.dto";
import { TellecallerCallDetailsResponse } from "./interfaces/telecallerDetails-response.dto";
export declare class LeadAnalyticService {
    private readonly leadModel;
    private readonly leadHistoryModel;
    attachCommonGraphFilters(pipeline: Aggregate<any[]>, organization: string, filter: GetGraphDataDto): void;
    getGraphData(organization: string, getGraphDto: GetGraphDataDto): Promise<{
        pieData: any;
        barData: any;
        stackData: any;
        callDetails: TellecallerCallDetailsResponse;
    }>;
    getLeadStatusDataForLineGraph(email: string, organization: string, year: string): Promise<any>;
    getLeadStatusCountForTelecallers(email: string, organization: string, startDate: Date, endDate: Date, campaign: string[], handler: string[]): Promise<{
        totalLeadsInOrg: Pick<any, string | number | symbol>;
        items: any;
        total_count: any;
    }>;
    getCampaignWiseLeadCount(email: string, organization: string, filters: GetGraphDataDto2): Promise<any>;
    getCampaignWiseLeadCountPerLeadCategory(email: string, organization: string, filter: GetGraphDataDto2): Promise<{
        XAxisLabel: string;
        YAxisLabel: string;
        stackBarData: any;
        max: number;
    }>;
    getTellecallerCallDetails(campaign: string, startDate: Date, endDate: Date): Promise<TellecallerCallDetailsResponse>;
}
