import { CampaignService } from "./campaign.service";
import { FindCampaignsDto } from "./dto/find-campaigns.dto";
import { User } from "../user/interfaces/user.interface";
export declare class CampaignController {
    private campaignService;
    constructor(campaignService: CampaignService);
    findAll(body: FindCampaignsDto): Promise<{
        data: any;
        metadata: any;
    }>;
    getDispositionForCampaign(campaignId: string): Promise<import("./interfaces/disposition.interface").Disposition | {
        error: string;
        e?: undefined;
    } | {
        e: any;
        error?: undefined;
    }>;
    getHandlerEmailHints(partialEmail: string): Promise<any[]>;
    getCampaignTypes(hint: string, user: User): Promise<import("./interfaces/campaign.interface").Campaign[]>;
    uploadConfig(file: any): Promise<void>;
    findOneByIdOrName(campaignId: string, identifier: string): Promise<any>;
    createCampaignAndDisposition(currrentUser: User, file: any, body: any): Promise<{
        campaign: import("./interfaces/campaign.interface").Campaign;
        disposition: import("./interfaces/disposition.interface").Disposition;
        filePath: string;
    }>;
    getDispositionByCampaignName(campaignName: string): Promise<any>;
}
