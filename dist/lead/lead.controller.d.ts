import { LeadService } from "./lead.service";
import { FindAllDto } from "./dto/find-all.dto";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { GeoLocationDto } from "./dto/geo-location.dto";
import { ReassignLeadDto } from "./dto/reassign-lead.dto";
import { SyncCallLogsDto } from "./dto/sync-call-logs.dto";
import { CreateEmailTemplateDto, BulkEmailDto } from "./dto/create-email-template.dto";
import { UploadMultipleFilesDto } from "./dto/generic.dto";
import { User } from "../user/interfaces/user.interface";
export declare class LeadController {
    private readonly leadService;
    constructor(leadService: LeadService);
    getAllLeadColumns(campaignType: string, user: any): Promise<{
        paths: any[];
    }>;
    insertOne(body: CreateLeadDto, user: User): Promise<import("./interfaces/lead.interface").Lead>;
    findAll(body: FindAllDto, user: any): Promise<{
        total: any;
        page: any;
        data: any;
    }>;
    addGeoLocation(body: GeoLocationDto, user: any): Promise<import("./interfaces/geo-location.interface").GeoLocation>;
    updateLead(body: CreateLeadDto, req: any, externalId: string): Promise<import("./interfaces/lead.interface").Lead>;
    reassignLead(body: ReassignLeadDto, user: User, externalId: string): Promise<any>;
    syncPhoneCalls(callLogs: SyncCallLogsDto[], user: User): Promise<any>;
    getLeadHistoryById(user: User, externalId: string): Promise<import("./interfaces/lead.interface").Lead>;
    getUsersPerformance(req: any): Promise<void>;
    getLeadSuggestions(user: User, externalId: string, page?: number, perPage?: number): Promise<any>;
    getBasicOverview(req: any): Promise<{
        result: any[];
        total: number;
    }>;
    getAllEmailTemplates(user: User, limit: number, skip: number, campaign: string): Promise<any>;
    createEmailTemplate(user: User, body: CreateEmailTemplateDto): Promise<import("./interfaces/email-template.interface").EmailTemplate>;
    sendBulkEmails(req: any, body: BulkEmailDto): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        error: any;
        success?: undefined;
    }>;
    uploadMultipleLeadFiles(user: User, body: UploadMultipleFilesDto, files: any): Promise<{
        error: string;
        files?: undefined;
        result?: undefined;
    } | {
        files: any[];
        result: void;
        error?: undefined;
    }>;
    saveEmailAttachments(files: any): any;
    findOneById(leadId: string, user: User): Promise<Pick<import("./interfaces/lead.interface").Lead, "address" | "source" | "_id" | "email" | "history" | "organization" | "leadStatus" | "externalId" | "campaign" | "firstName" | "lastName" | "amount" | "customerEmail" | "phoneNumberPrefix" | "phoneNumber" | "followUp" | "companyName" | "remarks" | "product" | "bucket" | "operationalArea" | "pincode" | "geoLocation">>;
    leadActivityByUser(email: string, startDate: string, endDate: string): Promise<any>;
    fetchNextLead(user: User, campaignId: string, leadStatus: string): Promise<{
        result: Pick<import("./interfaces/lead.interface").Lead, "address" | "source" | "_id" | "email" | "history" | "organization" | "leadStatus" | "externalId" | "campaign" | "firstName" | "lastName" | "amount" | "customerEmail" | "phoneNumberPrefix" | "phoneNumber" | "followUp" | "companyName" | "remarks" | "product" | "bucket" | "operationalArea" | "pincode" | "geoLocation">;
    }>;
    getAllAlarms(user: User, body: any): Promise<any>;
}
