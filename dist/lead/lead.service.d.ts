import { DocumentDefinition, Model } from "mongoose";
import { Lead } from "./interfaces/lead.interface";
import { User } from "../user/interfaces/user.interface";
import { Alarm } from "./interfaces/alarm";
import { NotificationService } from "../utils/notification.service";
import { EmailTemplate } from "./interfaces/email-template.interface";
import { CampaignConfig } from "./interfaces/campaign-config.interface";
import { GeoLocation } from "./interfaces/geo-location.interface";
import { UpdateLeadDto } from "./dto/update-lead.dto";
import { Campaign } from "../campaign/interfaces/campaign.interface";
import { FiltersDto } from "./dto/find-all.dto";
import { AttachmentDto } from "./dto/create-email-template.dto";
import { S3UploadedFiles } from "./dto/generic.dto";
import { UpdateContactDto } from "./dto/update-contact.dto";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { GetTransactionDto } from "./dto/get-transaction.dto";
import { RulesService } from "../rules/rules.service";
import { UserService } from "../user/user.service";
import { Queue } from "bull";
import { FetchNextLeadDto } from "./dto/fetch-next-lead.dto";
import { AdminAction } from "../agent/interface/admin-actions.interface";
import { LeadHistory } from "./interfaces/lead-history.interface";
import { Logger } from "nestjs-pino";
import { UploadService } from "../upload/upload.service";
import { CallLog } from "./interfaces/call-log.interface";
import { SyncCallLogsDto } from "./dto/sync-call-logs.dto";
export declare class LeadService {
    private readonly leadModel;
    private readonly adminActionModel;
    private readonly campaignConfigModel;
    private readonly campaignModel;
    private readonly emailTemplateModel;
    private readonly leadHistoryModel;
    private readonly geoLocationModel;
    private readonly alarmModel;
    private readonly callLog;
    private leadUploadQueue;
    private uploadService;
    private readonly ruleService;
    private userService;
    private notificationService;
    private readonly logger;
    constructor(leadModel: Model<Lead>, adminActionModel: Model<AdminAction>, campaignConfigModel: Model<CampaignConfig>, campaignModel: Model<Campaign>, emailTemplateModel: Model<EmailTemplate>, leadHistoryModel: Model<LeadHistory>, geoLocationModel: Model<GeoLocation>, alarmModel: Model<Alarm>, callLog: Model<CallLog>, leadUploadQueue: Queue, uploadService: UploadService, ruleService: RulesService, userService: UserService, notificationService: NotificationService, logger: Logger);
    saveEmailAttachments(files: any): any;
    reassignBulkLead(user: User, newUserEmail: string, leadIds: string[]): Promise<any>;
    reassignLead(activeUserEmail: string, oldUserEmail: string, newUserEmail: string, lead: Partial<Lead>): Promise<{
        result: Pick<any, string | number | symbol> | Pick<any, string | number | symbol>[];
        leadHistory: LeadHistory;
    }>;
    createEmailTemplate(userEmail: string, content: any, subject: string, campaign: string, attachments: AttachmentDto[], organization: string, templateName: string): Promise<EmailTemplate>;
    getAllEmailTemplates(limit: any, skip: any, campaign: string, organization: string): Promise<Pick<EmailTemplate, "_id" | "content" | "email" | "organization" | "campaign" | "subject" | "attachments">[]>;
    getLeadHistoryById(externalId: string, organization: any): Promise<Lead>;
    getLeadReassignmentHistory(email: string): Promise<any>;
    getBasicOverview(): Promise<{
        result: any[];
        total: number;
    }>;
    findAll(page: number, perPage: number, sortBy: string, showCols: string[], searchTerm: string, filters: FiltersDto, activeUserEmail: string, roleType: string, organization: string, typeDict: any, campaignId: string, userId: any): Promise<{
        total: any;
        page: any;
        data: any;
    }>;
    getLeadColumns(campaignId: any, removeFields: any): Promise<{
        paths: CampaignConfig[];
    }>;
    insertOne(body: any, activeUserEmail: string, organization: string): Promise<Lead>;
    findOneById(leadId: string, email: string, roleType: string): Promise<{
        lead: Pick<Lead, "address" | "source" | "_id" | "email" | "fullName" | "organization" | "leadStatus" | "companyName" | "externalId" | "campaign" | "firstName" | "lastName" | "amount" | "followUp" | "pincode" | "nextAction" | "documentLinks" | "notes" | "campaignId" | "contact" | "state" | "requestedInformation" | "isPristine" | "archived" | "transactionCount">;
        leadHistory: any[];
    }>;
    patch(productId: string, body: any[]): Promise<any>;
    createLead(body: CreateLeadDto, email: string, organization: string, campaignId: string, campaignName: string): Promise<void | Lead>;
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
    uploadMultipleLeadFiles(files: S3UploadedFiles[], campaignName: string, uploader: string, organization: string, userId: string, pushtoken: any, campaignId: string, firebaseToken: string): Promise<import("bull").Job<any>>;
    uploadFileAndGetMetadata({ contentType, filePath, key }: {
        contentType: any;
        filePath: any;
        key: any;
    }): Promise<import("aws-sdk/clients/s3").ManagedUpload.SendData>;
    addGeolocation(activeUserId: string, lat: number, lng: number, organization: string): Promise<GeoLocation>;
    getPerformance(): Promise<void>;
    updateLead({ organization, leadId, lead, geoLocation, handlerEmail, handlerName, emailForm, requestedInformation, campaignId, callRecord, reassignToUser, }: UpdateLeadDto & {
        leadId: string;
        organization: string;
        handlerEmail: string;
        handlerName: string;
    }): Promise<{}>;
    sendEmailToLead({ content, subject, attachments, email }: {
        content: any;
        subject: any;
        attachments: any;
        email: any;
    }): Promise<void>;
    leadActivityByUser(startDate: string, endDate: string, email: string): Promise<any>;
    getUpdatedAtQuery(startDate: string, endDate: string): Promise<{
        updatedAt: {
            $gt: Date;
        };
    }>;
    findInjectableLeads(organization: string, email: string, campaignId: string, projection: any): Promise<Lead>;
    static postProcessLead(lead: DocumentDefinition<Lead>): Pick<Lead, "address" | "source" | "_id" | "email" | "fullName" | "organization" | "leadStatus" | "companyName" | "externalId" | "campaign" | "firstName" | "lastName" | "amount" | "followUp" | "pincode" | "nextAction" | "documentLinks" | "notes" | "campaignId" | "contact" | "state" | "requestedInformation" | "isPristine" | "archived" | "transactionCount">;
    fetchNextLead({ campaignId, filters, email, organization, typeDict, roleType, nonKeyFilters, }: FetchNextLeadDto & {
        campaignId: string;
        email: string;
        organization: string;
        roleType: string;
    }): Promise<{
        lead: Pick<Lead, "address" | "source" | "_id" | "email" | "fullName" | "organization" | "leadStatus" | "companyName" | "externalId" | "campaign" | "firstName" | "lastName" | "amount" | "followUp" | "pincode" | "nextAction" | "documentLinks" | "notes" | "campaignId" | "contact" | "state" | "requestedInformation" | "isPristine" | "archived" | "transactionCount">;
        leadHistory: any[];
        isInjectableLead: boolean;
    }>;
    preassignLead(lead: Lead, roleType: string, email: string): Promise<void>;
    getSaleAmountByLeadStatus(campaignName?: string): any;
    getTransactions(organization: string, email: string, roleType: string, payload: GetTransactionDto): Promise<{
        response: Partial<LeadHistory>[];
        total: number;
    }>;
    getFollowUps({ interval, organization, email, campaignId, limit, skip, page, roleType }: {
        interval: any;
        organization: any;
        email: any;
        campaignId: any;
        limit: any;
        skip: any;
        page: any;
        roleType: any;
    }): Promise<any>;
    checkPrecondition(user: User, subordinateEmail: string): Promise<void>;
    getAllAlarms(body: any, organization: any): Promise<any>;
    getUsersActivity(dateRange: Date[], userEmail: string, organization: string): Promise<any>;
    addContact(contact: UpdateContactDto, leadId: string): Promise<Lead>;
    archiveLead(leadId: string): Promise<Lead>;
    archiveLeads(leadIds: string[]): Promise<any>;
    unarchiveLeads(leadIds: string[]): Promise<any>;
    transferLeads(leadIds: string[], toCampaignId: string): Promise<Pick<any, string | number | symbol> | Pick<any, string | number | symbol>[]>;
    openClosedLeads(leadIds: string[]): Promise<any>;
    syncPhoneCalls(callLogs: SyncCallLogsDto[], organization: any, user: string): Promise<CallLog[]>;
}
