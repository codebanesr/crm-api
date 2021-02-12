export declare class LeadAnalyticService {
    private readonly leadModel;
    private readonly leadHistoryModel;
    getGraphData(organization: string, userList: string[]): Promise<{
        pieData: any[];
        barData: any[];
        stackData: any[];
    }>;
}
