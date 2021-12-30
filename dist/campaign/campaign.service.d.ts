/// <reference types="lodash" />
import { Model } from "mongoose";
import { Campaign } from "./interfaces/campaign.interface";
import { CampaignConfig } from "../lead/interfaces/campaign-config.interface";
import { Disposition } from "./interfaces/disposition.interface";
import { AdminAction } from "../agent/interface/admin-actions.interface";
import { CampaignForm } from "./interfaces/campaign-form.interface";
import { Lead } from "../lead/interfaces/lead.interface";
import { UpdateConfigsDto } from "./dto/update-configs.dto";
import { CreateCampaignAndDispositionDto } from "./dto/create-campaign-disposition.dto";
import { DeleteCampaignConfigDto } from "./dto/delete-campaignConfig.dto";
import { DcaeDto } from "./dto/dcae.dto";
export declare class CampaignService {
    private readonly campaignModel;
    private readonly campaignConfigModel;
    private readonly dispositionModel;
    private readonly adminActionModel;
    private readonly campaignFormModel;
    private readonly leadModel;
    constructor(campaignModel: Model<Campaign>, campaignConfigModel: Model<CampaignConfig>, dispositionModel: Model<Disposition>, adminActionModel: Model<AdminAction>, campaignFormModel: Model<CampaignForm>, leadModel: Model<Lead>);
    findAll({ page, perPage, filters, sortBy, loggedInUserId, organization, roles, }: {
        page: any;
        perPage: any;
        filters: any;
        sortBy: any;
        loggedInUserId: any;
        organization: any;
        roles: any;
    }): Promise<{
        data: any;
        metadata: any;
        quickStatsAgg: import("lodash").Dictionary<any>;
    }>;
    findOneByIdOrName(campaignId: any): Promise<Pick<Campaign, "groups" | "_id" | "comment" | "type" | "organization" | "startDate" | "endDate" | "campaignName" | "workflow" | "createdBy" | "assignees" | "editableCols" | "browsableCols" | "uniqueCols" | "formModel" | "advancedSettings" | "archived" | "assignTo" | "autodialSettings">>;
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
    getDispositionForCampaign(campaignId: string): Promise<Pick<Disposition, "options" | "_id" | "organization" | "campaign" | "creator"> | {
        error: string;
        e?: undefined;
    } | {
        e: any;
        error?: undefined;
    }>;
    uploadConfig(file: any): Promise<void>;
    createCampaignAndDisposition({ activeUserId, dispositionData, campaignInfo, organization, editableCols, browsableCols, formModel, uniqueCols, assignTo, advancedSettings, groups, isNew, autodialSettings, }: CreateCampaignAndDispositionDto & {
        activeUserId: string;
        organization: string;
    }): Promise<{
        campaign: any;
        disposition: import("mongodb").FindAndModifyWriteOpResultObject<Disposition>;
    }>;
    saveCampaignSchema(ccJSON: any[], others: any & {
        organization: string;
    }): Promise<string>;
    updateCampaignForm({ organization, payload, campaign }: {
        organization: any;
        payload: any;
        campaign: any;
    }): Promise<any>;
    archiveCampaign(organization: string, campaignId: string): Promise<Campaign>;
    getQuickStatsForCampaigns(campaignIds: string[], organization: string): Promise<import("lodash").Dictionary<any>>;
    updateConfigs(config: UpdateConfigsDto, organization: string, campaignId: string, campaignName: string): Promise<Pick<CampaignConfig, "group" | "options" | "_id" | "name" | "type" | "organization" | "readableField" | "internalField" | "checked" | "campaignId">>;
    createCampaignConfigs(): void;
    deleteConfig(deleteConfigDto: DeleteCampaignConfigDto): Promise<{
        status: boolean;
    }>;
    cloneCampaign(campaignId: string): Promise<void>;
    deleteCampaignAndAllAssociatedEntities(dcAE: DcaeDto): Promise<{
        leads: any;
        campaign: any;
        campaignConfig: any;
        disposition: any;
    }>;
    getCampaignsForOrganization(organization: string): Promise<Pick<Campaign, "groups" | "_id" | "comment" | "type" | "organization" | "startDate" | "endDate" | "campaignName" | "workflow" | "createdBy" | "assignees" | "editableCols" | "browsableCols" | "uniqueCols" | "formModel" | "advancedSettings" | "archived" | "assignTo" | "autodialSettings">[]>;
}
