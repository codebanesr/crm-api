import { Aggregate } from "mongoose";
import { GetGraphDataDto } from "./dto/get-graph-data.dto";
export declare class LeadAnalyticService {
    private readonly leadModel;
    private readonly leadHistoryModel;
    private startDate;
    private endDate;
    attachCommonGraphFilters(pipeline: Aggregate<any[]>, organization: string, filter: GetGraphDataDto): void;
    getGraphData(organization: string, userList: string[]): Promise<{
        pieData: any[];
        barData: any[];
        stackData: any[];
    }>;
    getLeadStatusDataForLineGraph(email: string, organization: string, year: string): Promise<any>;
    getLeadStatusCountForTelecallers(email: string, organization: string): Promise<{
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
}
