import { LeadService } from "./lead.service";
import { FindAllDto } from "./dto/find-all.dto";
import { UpdateLeadDto } from "./dto/update-lead.dto";
import { GeoLocationDto } from "./dto/geo-location.dto";
import { ReassignLeadDto } from "./dto/reassign-lead.dto";
import { SyncCallLogsDto } from "./dto/sync-call-logs.dto";
import { CreateEmailTemplateDto, BulkEmailDto } from "./dto/create-email-template.dto";
import { UploadMultipleFilesDto } from "./dto/generic.dto";
import { User } from "../user/interfaces/user.interface";
import { UserActivityDto } from "../user/dto/user-activity.dto";
import { FollowUpDto } from "./dto/follow-up.dto";
import { FetchNextLeadDto } from "./dto/fetch-next-lead.dto";
import { UpdateContactDto } from "./dto/update-contact.dto";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { GetTransactionDto } from "./dto/get-transaction.dto";
import { Response } from "express";
export declare class LeadController {
    private readonly leadService;
    constructor(leadService: LeadService);
    getAllLeadColumns(campaignId: string, user: any): Promise<{
        paths: import("./interfaces/campaign-config.interface").CampaignConfig[];
    }>;
    insertOne(body: CreateLeadDto, user: User, campaignId: string, campaignName: string): Promise<void>;
    getTransactions(user: User, body: GetTransactionDto, isStreamable: boolean, res: Response): Promise<Response<any>>;
    findAll(body: FindAllDto, user: any): Promise<{
        total: any;
        page: any;
        data: any;
    }>;
    addGeoLocation(body: GeoLocationDto, user: any): Promise<import("./interfaces/geo-location.interface").GeoLocation>;
    updateLead(user: User, body: UpdateLeadDto, leadId: string): Promise<import("./interfaces/lead.interface").Lead>;
    addContact(body: UpdateContactDto, leadId: string): Promise<import("./interfaces/lead.interface").Lead>;
    reassignLead(body: ReassignLeadDto, user: User, externalId: string): Promise<any>;
    syncPhoneCalls(callLogs: SyncCallLogsDto[], user: User): Promise<any>;
    getLeadHistoryById(user: User, externalId: string): Promise<import("./interfaces/lead.interface").Lead>;
    getUsersPerformance(req: any): Promise<void>;
    getLeadSuggestions(user: User, externalId: string, page?: number, perPage?: number): Promise<any>;
    getBasicOverview(req: any): Promise<{
        result: any[];
        total: number;
    }>;
    getAllEmailTemplates(user: User, limit: number, skip: number, campaignId: string): Promise<Pick<import("./interfaces/email-template.interface").EmailTemplate, "_id" | "content" | "email" | "organization" | "subject" | "attachments" | "campaign">[]>;
    createEmailTemplate(user: User, body: CreateEmailTemplateDto): Promise<import("./interfaces/email-template.interface").EmailTemplate>;
    sendBulkEmails(req: any, body: BulkEmailDto): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        error: any;
        success?: undefined;
    }>;
    uploadMultipleLeadFiles(user: User, body: UploadMultipleFilesDto): Promise<{
        files: import("./dto/generic.dto").S3UploadedFiles[];
        result: void;
    }>;
    saveEmailAttachments(files: any): any;
    findOneById(leadId: string, user: User): Promise<{
        lead: Pick<import("./interfaces/lead.interface").Lead, "address" | "source" | "_id" | "email" | "organization" | "leadStatus" | "campaignId" | "externalId" | "campaign" | "firstName" | "lastName" | "amount" | "followUp" | "companyName" | "pincode" | "nextAction" | "documentLinks" | "contact" | "requestedInformation" | "state">;
        leadHistory: any[];
    }>;
    leadActivityByUser(email: string, startDate: string, endDate: string): Promise<any>;
    fetchNextLead(user: User, campaignId: string, body: FetchNextLeadDto): Promise<{
        lead: any;
        leadHistory: any[];
    }>;
    getAllAlarms(user: User, body: any): Promise<any>;
    usersActivityLog(userActivityDto: UserActivityDto, user: User): Promise<any>;
    fetchFollowUps(followUpDto: FollowUpDto, user: User): Promise<any>;
}
