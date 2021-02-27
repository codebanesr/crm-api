import { User } from "../user/interfaces/user.interface";
import { GetGraphDataDto } from "./dto/get-graph-data.dto";
import { LeadAnalyticService } from "./lead-analytic.service";
export declare class LeadAnalyticController {
    private analyticService;
    constructor(analyticService: LeadAnalyticService);
    getGraphData(user: User, graphInput: GetGraphDataDto): Promise<{
        pieData: any[];
        barData: any[];
        stackData: any[];
    }>;
    getLeadStatusDataForLineGraph(user: User, year: string): Promise<any>;
    getLeadStatusCountForTelecallers(user: User): Promise<{
        items: any;
        total_count: any;
    }>;
    getCampaignWiseLeadCount(user: User): Promise<any>;
    getCampaignWiseLeadCountPerLeadCategory(user: User): Promise<{
        XAxisLabel: string;
        YAxisLabel: string;
        stackBarData: any;
        max: any;
    }>;
}
