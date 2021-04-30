import { Aggregate } from "mongoose";
import { GetGraphDataDto } from "./dto/get-graph-data.dto";
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
    getLeadStatusCountForTelecallers(email: string, organization: string): Promise<{
        totalLeadsInOrg: Pick<any, string | number | symbol>;
        items: any;
        total_count: any;
    }>;
    getCampaignWiseLeadCount(email: string, organization: string, filters: GetGraphDataDto): Promise<any>;
    getCampaignWiseLeadCountPerLeadCategory(email: string, organization: string, filter: GetGraphDataDto): Promise<{
        XAxisLabel: string;
        YAxisLabel: string;
        stackBarData: any;
        max: number;
    }>;
    getUserTalktime(email: string, organization: string, filter: GetGraphDataDto): Promise<any>;
    getTellecallerCallDetails(campaign: string, startDate: Date, endDate: Date): Promise<TellecallerCallDetailsResponse>;
}
