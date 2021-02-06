import { Model } from "mongoose";
import { Lead } from "./interfaces/lead.interface";
import { User } from "../user/interfaces/user.interface";
import { Alarm } from "./interfaces/alarm";
import { IConfig } from "../utils/renameJson";
import { EmailTemplate } from "./interfaces/email-template.interface";
import { CampaignConfig } from "./interfaces/campaign-config.interface";
import { GeoLocation } from "./interfaces/geo-location.interface";
import { UpdateLeadDto } from "./dto/update-lead.dto";
import { Campaign } from "../campaign/interfaces/campaign.interface";
import { FiltersDto } from "./dto/find-all.dto";
import { AttachmentDto } from "./dto/create-email-template.dto";
import { S3UploadedFiles } from "./dto/generic.dto";
import { AdminAction } from "../user/interfaces/admin-actions.interface";
import { UploadService } from "../upload/upload.service";
import { PushNotificationService } from "../push-notification/push-notification.service";
import { UpdateContactDto } from "./dto/update-contact.dto";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { LeadHistory } from "./interfaces/lead-history.interface";
import { GetTransactionDto } from "./dto/get-transaction.dto";
import { RulesService } from "../rules/rules.service";
import { UserService } from "../user/user.service";
export declare class LeadService {
    private readonly leadModel;
    private readonly adminActionModel;
    private readonly campaignConfigModel;
    private readonly campaignModel;
    private readonly emailTemplateModel;
    private readonly leadHistoryModel;
    private readonly geoLocationModel;
    private readonly alarmModel;
    private readonly ruleService;
    private readonly s3UploadService;
    private readonly pushNotificationService;
    private userService;
    constructor(leadModel: Model<Lead>, adminActionModel: Model<AdminAction>, campaignConfigModel: Model<CampaignConfig>, campaignModel: Model<Campaign>, emailTemplateModel: Model<EmailTemplate>, leadHistoryModel: Model<LeadHistory>, geoLocationModel: Model<GeoLocation>, alarmModel: Model<Alarm>, ruleService: RulesService, s3UploadService: UploadService, pushNotificationService: PushNotificationService, userService: UserService);
    saveEmailAttachments(files: any): any;
    reassignLead(activeUserEmail: string, oldUserEmail: string, newUserEmail: string, lead: Partial<Lead>): Promise<any>;
    createEmailTemplate(userEmail: string, content: any, subject: string, campaign: string, attachments: AttachmentDto[], organization: string, templateName: string): Promise<EmailTemplate>;
    getAllEmailTemplates(limit: any, skip: any, campaign: string, organization: string): Promise<Pick<EmailTemplate, "_id" | "content" | "email" | "organization" | "campaign" | "subject" | "attachments">[]>;
    getLeadHistoryById(externalId: string, organization: any): Promise<Lead>;
    getLeadReassignmentHistory(email: string): Promise<any>;
    getBasicOverview(): Promise<{
        result: any[];
        total: number;
    }>;
    findAll(page: number, perPage: number, sortBy: string, showCols: string[], searchTerm: string, filters: FiltersDto, activeUserEmail: string, roleType: string, organization: string, typeDict: any, campaignId: string): Promise<{
        total: any;
        page: any;
        data: any;
    }>;
    getLeadColumns(campaignId: any, removeFields: any): Promise<{
        paths: CampaignConfig[];
    }>;
    insertOne(body: any, activeUserEmail: string, organization: string): Promise<Lead>;
    findOneById(leadId: string, organization: string): Promise<{
        lead: Pick<Lead, "address" | "source" | "_id" | "email" | "fullName" | "organization" | "leadStatus" | "companyName" | "externalId" | "campaign" | "firstName" | "lastName" | "amount" | "followUp" | "pincode" | "nextAction" | "documentLinks" | "campaignId" | "contact" | "state" | "requestedInformation">;
        leadHistory: any[];
    }>;
    patch(productId: string, body: any[]): Promise<any>;
    createLead(body: CreateLeadDto, email: string, organization: string, campaignId: string, campaignName: string): Promise<Lead>;
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
    uploadMultipleLeadFiles(files: S3UploadedFiles[], campaignName: string, uploader: string, organization: string, userId: string, pushtoken: any, campaignId: string): Promise<{
        files: S3UploadedFiles[];
        result: void;
    }>;
    addGeolocation(activeUserId: string, lat: number, lng: number, organization: string): Promise<GeoLocation>;
    getPerformance(): Promise<void>;
    updateLead({ organization, leadId, lead, geoLocation, handlerEmail, handlerName, reassignmentInfo, emailForm, requestedInformation, campaignId, callRecord }: UpdateLeadDto & {
        leadId: string;
        organization: string;
        handlerEmail: string;
        handlerName: string;
    }): Promise<Lead>;
    parseLeadFiles(files: S3UploadedFiles[], ccnfg: IConfig[], campaignName: string, organization: string, uploader: string, uploaderId: string, pushtoken: string, campaignId: string, uniqueAttr: Partial<Campaign>): Promise<void>;
    saveLeadsFromExcel(leads: any[], campaignName: string, originalFileName: string, organization: string, uploader: string, uploaderId: string, pushtoken: any, campaignId: string, uniqueAttr: Partial<Campaign>): Promise<any>;
    leadActivityByUser(startDate: string, endDate: string, email: string): Promise<any>;
    getUpdatedAtQuery(startDate: string, endDate: string): Promise<{
        updatedAt: {
            $gt: Date;
        };
    }>;
    fetchNextLead({ campaignId, filters, email, organization, typeDict, roleType }: {
        campaignId: string;
        filters: Map<string, string>;
        email: string;
        organization: string;
        typeDict: Map<string, any>;
        roleType: string;
    }): Promise<{
        lead: any;
        leadHistory: any[];
    }>;
    getSaleAmountByLeadStatus(campaignName?: string): any;
    getTransactions(organization: string, email: string, roleType: string, payload: GetTransactionDto, isStreamable: boolean): Promise<{
        response: Partial<LeadHistory>[];
        total: number;
    }>;
    getFollowUps({ interval, organization, email, campaignName, limit, skip, page, }: {
        interval: any;
        organization: any;
        email: any;
        campaignName: any;
        limit: any;
        skip: any;
        page: any;
    }): Promise<any>;
    checkPrecondition(user: User, subordinateEmail: string): Promise<void>;
    getAllAlarms(body: any, organization: any): Promise<any>;
    getUsersActivity(dateRange: Date[], userEmail: string, organization: string): Promise<any>;
    sendEmailToLead({ content, subject, attachments, email }: {
        content: any;
        subject: any;
        attachments: any;
        email: any;
    }): Promise<boolean>;
    addContact(contact: UpdateContactDto, leadId: string): Promise<Lead>;
}
