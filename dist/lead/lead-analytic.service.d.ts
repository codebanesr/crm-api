export declare class LeadAnalyticService {
    private readonly leadModel;
    private readonly leadHistoryModel;
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
    getCampaignWiseLeadCount(email: string, organization: string): Promise<any>;
    getCampaignWiseLeadCountPerLeadCategory(email: string, organization: string): Promise<{
        XAxisLabel: string;
        YAxisLabel: string;
        stackBarData: any;
        max: any;
    }>;
}
