/// <reference types="lodash" />
/// <reference types="mongoose" />
import { CampaignService } from "./campaign.service";
import { FindCampaignsDto } from "./dto/find-campaigns.dto";
import { User } from "../user/interfaces/user.interface";
import { UpdateConfigsDto } from "./dto/update-configs.dto";
import { CreateCampaignAndDispositionDto } from "./dto/create-campaign-disposition.dto";
export declare class CampaignController {
    private campaignService;
    constructor(campaignService: CampaignService);
    findAll(body: FindCampaignsDto, user: User): Promise<{
        data: any;
        metadata: any;
        quickStatsAgg: import("lodash").Dictionary<any>;
    }>;
    getDispositionForCampaign(campaignId: string): Promise<Pick<import("./interfaces/disposition.interface").Disposition, "options" | "_id" | "organization" | "campaign" | "creator"> | {
        error: string;
        e?: undefined;
    } | {
        e: any;
        error?: undefined;
    }>;
    getHandlerEmailHints(partialEmail: string): Promise<any[]>;
    getCampaignTypes(hint: string, user: User): Promise<import("./interfaces/campaign.interface").Campaign[]>;
    uploadConfig(file: any): Promise<void>;
    createCampaignForm(user: User, body: any): Promise<any>;
    findOneByIdOrName(campaignId: string): Promise<Pick<import("./interfaces/campaign.interface").Campaign, "groups" | "_id" | "comment" | "type" | "organization" | "campaignName" | "startDate" | "endDate" | "archived" | "workflow" | "createdBy" | "assignees" | "editableCols" | "browsableCols" | "uniqueCols" | "formModel" | "advancedSettings" | "assignTo" | "autodialSettings">>;
    createCampaignAndDisposition(currrentUser: User, body: CreateCampaignAndDispositionDto): Promise<{
        campaign: import("./interfaces/campaign.interface").Campaign;
        disposition: import("mongodb").FindAndModifyWriteOpResultObject<import("./interfaces/disposition.interface").Disposition>;
    }>;
    getDispositionByCampaignName(campaignName: string, user: User): Promise<any>;
    archiveCampaign(user: User, body: any): Promise<import("./interfaces/campaign.interface").Campaign>;
    updateConfigs(user: User, configs: UpdateConfigsDto, campaignId: string, campaignName: string): Promise<Pick<import("../lead/interfaces/campaign-config.interface").CampaignConfig, "group" | "options" | "_id" | "name" | "type" | "organization" | "readableField" | "campaignId" | "internalField" | "checked">>;
    deleteConfig(configId: string): import("mongoose").Query<{
        ok?: number;
        n?: number;
    } & {
        deletedCount?: number;
    }>;
}
