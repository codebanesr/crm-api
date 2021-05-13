import { User } from "../user/interfaces/user.interface";
import { GetGraphDataDto, GetGraphDataDto2 } from "./dto/get-graph-data.dto";
import { LeadAnalyticService } from "./lead-analytic.service";
export declare class LeadAnalyticController {
    private analyticService;
    constructor(analyticService: LeadAnalyticService);
    getGraphData(user: User, graphInput: GetGraphDataDto): Promise<{
        pieData: any;
        barData: any;
        stackData: any;
        callDetails: import("./interfaces/telecallerDetails-response.dto").TellecallerCallDetailsResponse;
        userCallDurationTransposed: any;
    }>;
    getLeadStatusDataForLineGraph(user: User, graphFilter: GetGraphDataDto, year: string): Promise<any>;
    getLeadStatusCountForTelecallers(user: User, filters: GetGraphDataDto2): Promise<{
        totalLeadsInOrg: Pick<any, string | number | symbol>;
        items: any;
        total_count: any;
    }>;
    getCampaignWiseLeadCount(user: User, graphFilter: GetGraphDataDto2): Promise<any>;
    getCampaignWiseLeadCountPerLeadCategory(user: User, graphFilter: GetGraphDataDto2): Promise<{
        XAxisLabel: string;
        YAxisLabel: string;
        stackBarData: any;
        max: number;
    }>;
}
