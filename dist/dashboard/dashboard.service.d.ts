import { Campaign } from "../campaign/interfaces/campaign.interface";
import { CallLog } from "../lead/interfaces/call-log.interface";
import { CampaignConfig } from "../lead/interfaces/campaign-config.interface";
import { EmailTemplate } from "../lead/interfaces/email-template.interface";
import { Lead } from "../lead/interfaces/lead.interface";
import { User } from "../user/interfaces/user.interface";
import { Model } from "mongoose";
export declare class DashboardService {
    private readonly leadModel;
    private readonly userModel;
    private readonly campaignConfigModel;
    private readonly campaignModel;
    private readonly emailTemplateModel;
    private readonly callLogModel;
    constructor(leadModel: Model<Lead>, userModel: Model<User>, campaignConfigModel: Model<CampaignConfig>, campaignModel: Model<Campaign>, emailTemplateModel: Model<EmailTemplate>, callLogModel: Model<CallLog>);
    getAggregatedLeadStatus(organization: string, dateArray: string[]): any;
    getAggrgegatedLeadStatusForDepartment(organization: string, dateArray: string[]): any;
    getLeadInfoByMonth(organization: string, month: number): Promise<any>;
}
