import { Model } from "mongoose";
import { Lead } from "./interfaces/lead.interface";
import { User } from "../user/interfaces/user.interface";
import { Alarm } from "./interfaces/alarm";
import { IConfig } from "../utils/renameJson";
import { EmailTemplate } from "./interfaces/email-template.interface";
import { CampaignConfig } from "./interfaces/campaign-config.interface";
import { CallLog } from "./interfaces/call-log.interface";
import { GeoLocation } from "./interfaces/geo-location.interface";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { SyncCallLogsDto } from "./dto/sync-call-logs.dto";
import { Campaign } from "../campaign/interfaces/campaign.interface";
import { FiltersDto } from "./dto/find-all.dto";
export declare class LeadService {
    private readonly leadModel;
    private readonly userModel;
    private readonly campaignConfigModel;
    private readonly campaignModel;
    private readonly emailTemplateModel;
    private readonly callLogModel;
    private readonly geoLocationModel;
    private readonly alarmModel;
    constructor(leadModel: Model<Lead>, userModel: Model<User>, campaignConfigModel: Model<CampaignConfig>, campaignModel: Model<Campaign>, emailTemplateModel: Model<EmailTemplate>, callLogModel: Model<CallLog>, geoLocationModel: Model<GeoLocation>, alarmModel: Model<Alarm>);
    saveEmailAttachments(files: any): any;
    reassignLead(activeUserEmail: string, oldUserEmail: string, newUserEmail: string, lead: Partial<Lead>): Promise<any>;
    createEmailTemplate(userEmail: string, content: any, subject: string, campaign: string, attachments: any, organization: string): Promise<EmailTemplate>;
    getAllEmailTemplates(limit: any, skip: any, campaign: string, organization: string): Promise<any>;
    getLeadHistoryById(externalId: string, organization: any): Promise<Lead>;
    getLeadReassignmentHistory(email: string): Promise<any>;
    getBasicOverview(): Promise<{
        result: any[];
        total: number;
    }>;
    findAll(page: number, perPage: number, sortBy: string, showCols: string[], searchTerm: string, filters: FiltersDto, activeUserEmail: string, roleType: string, organization: string): Promise<{
        total: any;
        page: any;
        data: any;
    }>;
    getLeadColumns(campaignType: string, organization: string): Promise<{
        paths: any[];
    }>;
    insertOne(body: any, activeUserEmail: string, organization: string): Promise<Lead>;
    findOneById(leadId: string, organization: string): Promise<Pick<Lead, "address" | "source" | "_id" | "email" | "history" | "organization" | "leadStatus" | "externalId" | "campaign" | "firstName" | "lastName" | "amount" | "customerEmail" | "phoneNumberPrefix" | "phoneNumber" | "followUp" | "companyName" | "remarks" | "product" | "bucket" | "operationalArea" | "pincode" | "geoLocation">>;
    patch(productId: string, body: any[]): Promise<any>;
    deleteOne(leadId: string, activeUserEmail: string): Promise<Pick<any, string | number | symbol>>;
    createAlarm(alarmObj: Partial<Alarm>): Promise<Alarm>;
    sendBulkEmails(emails: string[], subject: string, text: string, attachments: any, organization: string): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        error: any;
        success?: undefined;
    }>;
    suggestLeads(activeUserEmail: string, leadId: string, organization: string, limit?: number): Promise<any>;
    uploadMultipleLeadFiles(files: any[], campaignName: string): Promise<{
        error: string;
        files?: undefined;
        result?: undefined;
    } | {
        files: any[];
        result: void;
        error?: undefined;
    }>;
    syncPhoneCalls(callLogs: SyncCallLogsDto[], organization: any, user: any): Promise<any>;
    addGeolocation(activeUserId: string, lat: number, lng: number, organization: string): Promise<GeoLocation>;
    getPerformance(): Promise<void>;
    updateLead(externalId: string, lead: Partial<CreateLeadDto>): Promise<Lead>;
    saveLeads(leads: any[], campaignName: string, originalFileName: string): Promise<void>;
    getSubordinates(email: string, roleType: string): Promise<any>;
    parseLeadFiles(files: any[], ccnfg: IConfig[], campaignName: string): Promise<void>;
    saveLeadsFromExcel(leads: any[], campaignName: string, originalFileName: string): Promise<void>;
    leadActivityByUser(startDate: string, endDate: string, email: string): Promise<any>;
    getUpdatedAtQuery(startDate: string, endDate: string): Promise<{
        updatedAt: {
            $gt: Date;
        };
    }>;
    fetchNextLead(campaignId: string, leadStatus: string, email: string, organization: string): Promise<{
        result: Pick<Lead, "address" | "source" | "_id" | "email" | "history" | "organization" | "leadStatus" | "externalId" | "campaign" | "firstName" | "lastName" | "amount" | "customerEmail" | "phoneNumberPrefix" | "phoneNumber" | "followUp" | "companyName" | "remarks" | "product" | "bucket" | "operationalArea" | "pincode" | "geoLocation">;
    }>;
    getSaleAmountByLeadStatus(campaignName?: string): any;
    getFollowUps(): Promise<void>;
    getAllAlarms(body: any, organization: any): Promise<any>;
}
