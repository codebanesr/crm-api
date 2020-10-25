import { Model } from "mongoose";
import { Campaign } from "./interfaces/campaign.interface";
import { CampaignConfig } from "../lead/interfaces/campaign-config.interface";
import { Disposition } from "./interfaces/disposition.interface";
import { AdminAction } from "../agent/interface/admin-actions.interface";
export declare class CampaignService {
    private readonly campaignModel;
    private readonly campaignConfigModel;
    private readonly dispositionModel;
    private readonly adminActionModel;
    constructor(campaignModel: Model<Campaign>, campaignConfigModel: Model<CampaignConfig>, dispositionModel: Model<Disposition>, adminActionModel: Model<AdminAction>);
    findAll({ page, perPage, filters, sortBy, loggedInUserId }: {
        page: any;
        perPage: any;
        filters: any;
        sortBy: any;
        loggedInUserId: any;
    }): Promise<{
        data: any;
        metadata: any;
    }>;
    findOneByIdOrName(campaignId: any, identifier: any): Promise<any>;
    patch(campaignId: any, requestBody: any): Promise<any>;
    deleteOne(campaignId: any): Promise<{
        ok?: number;
        n?: number;
    } & {
        deletedCount?: number;
    }>;
    getHandlerEmailHints(partialEmail: string): Promise<any[]>;
    getCampaignTypes(hint: any, organization: any): Promise<Campaign[]>;
    defaultDisposition(): Promise<Disposition | {
        error: string;
        e?: undefined;
    } | {
        e: any;
        error?: undefined;
    }>;
    getDispositionForCampaign(campaignId: string): Promise<Disposition | {
        error: string;
        e?: undefined;
    } | {
        e: any;
        error?: undefined;
    }>;
    uploadConfig(file: any): Promise<void>;
    createCampaignAndDisposition({ activeUserId, file, dispositionData, campaignInfo, organization, }: {
        activeUserId: string;
        file: any;
        dispositionData: any;
        campaignInfo: any;
        organization: string;
    }): Promise<{
        campaign: Campaign;
        disposition: Disposition;
        filePath: string;
    }>;
    saveCampaignSchema(ccJSON: any[], others: any & {
        organization: string;
    }): Promise<string>;
    getDispositionByCampaignName(campaignName: string, organization: string): Promise<any>;
}
