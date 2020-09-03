import {
  Controller,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Body,
  Put,
  Param,
  Logger,
  Query,
  UseInterceptors,
  UploadedFiles,
  Patch,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { LeadService } from "./lead.service";
import { FindAllDto } from "./dto/find-all.dto";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { Request as ERequest } from "express";
import { GeoLocationDto } from "./dto/geo-location.dto";
import { ReassignLeadDto } from "./dto/reassign-lead.dto";
import { SyncCallLogsDto } from "./dto/sync-call-logs.dto";
import {
  CreateEmailTemplateDto,
  BulkEmailDto,
} from "./dto/create-email-template.dto";
import { FilesInterceptor } from "@nestjs/platform-express";
import { UploadMultipleFilesDto } from "./dto/generic.dto";

@ApiTags("Lead")
@Controller("lead")
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post("")
  @ApiOperation({ summary: "Fetches all lead for the given user" })
  @HttpCode(HttpStatus.OK)
  insertOne(@Body() body: CreateLeadDto, @Request() req) {
    return this.leadService.insertOne(body, req.user.email);
  }

  @Post("findAll")
  @ApiOperation({ summary: "Fetches all lead for the given user" })
  @HttpCode(HttpStatus.OK)
  findAll(@Body() body: FindAllDto, @Request() req) {
    const {
      page,
      perPage,
      sortBy = "createdAt",
      showCols,
      searchTerm,
      filters,
    } = body;

    const { email, roleType } = req.user;
    return this.leadService.findAll(
      page,
      perPage,
      sortBy,
      showCols,
      searchTerm,
      filters,
      email,
      roleType
    );
  }

  @Post("geoLocation")
  @ApiOperation({ summary: "Adds users location emitted from the device" })
  @HttpCode(HttpStatus.OK)
  addGeoLocation(@Body() body: GeoLocationDto, @Request() req) {
    const { lat, lng } = body;
    const { id } = req.user;
    return this.leadService.addGeolocation(req.user.id, lat, lng);
  }

  @Put(":externalId")
  @ApiOperation({ summary: "Adds users location emitted from the device" })
  @HttpCode(HttpStatus.OK)
  updateLead(
    @Body() body: CreateLeadDto,
    @Request() req,
    @Param("externalId") externalId: string
  ) {
    return this.leadService.updateLead(externalId, body);
  }

  @Post("reassignLead")
  @ApiOperation({ summary: "Adds users location emitted from the device" })
  @HttpCode(HttpStatus.OK)
  reassignLead(
    @Body() body: ReassignLeadDto,
    @Request() req,
    @Param("externalId") externalId: string
  ) {
    return this.leadService.reassignLead(
      req.user.email,
      body.oldUserEmail,
      body.newUserEmail,
      body.lead
    );
  }

  @Post("syncPhoneCalls")
  @ApiOperation({ summary: "Sync phone calls from device to database" })
  @HttpCode(HttpStatus.OK)
  syncPhoneCalls(@Body() callLogs: SyncCallLogsDto) {
    return this.leadService.syncPhoneCalls(callLogs);
  }

  @Get("getLeadHistoryById/:externalId")
  @ApiOperation({
    summary: "Get leads history by passing in external id of lead",
  })
  @HttpCode(HttpStatus.OK)
  getLeadHistoryById(@Request() req, @Param("externalId") externalId: string) {
    return this.leadService.getLeadHistoryById(externalId);
  }

  @Get("user/performance")
  @ApiOperation({ summary: "Get users performance" })
  @HttpCode(HttpStatus.OK)
  getUsersPerformance(@Request() req) {
    return this.leadService.getPerformance();
  }

  @Get("basicOverview")
  @ApiOperation({
    summary: "Get basic performance overviews for graphs, deprecated",
  })
  @HttpCode(HttpStatus.OK)
  getBasicOverview(@Request() req) {
    return this.leadService.getBasicOverview();
  }

  @Get("getAllEmailTemplates")
  @ApiOperation({
    summary: "Get all saved email templates",
  })
  @HttpCode(HttpStatus.OK)
  getAllEmailTemplates(
    @Query("limit") limit: number,
    @Query("skip") skip: number,
    @Query("campaign") campaign: string
  ) {
    return this.leadService.getAllEmailTemplates(limit, skip, campaign);
  }

  @Post("createEmailTemplate")
  @ApiOperation({
    summary: "Create an email template to be used by agents",
  })
  @HttpCode(HttpStatus.OK)
  createEmailTemplate(@Request() req, @Body() body: CreateEmailTemplateDto) {
    const { email: userEmail } = req.user;
    const { content, subject, campaign, attachments } = body;

    Logger.debug(body);
    return this.leadService.createEmailTemplate(
      userEmail,
      content,
      subject,
      campaign,
      attachments
    );
  }

  @Post("bulkEmail")
  @ApiOperation({
    summary: "Send Bulk Emails",
  })
  @HttpCode(HttpStatus.OK)
  sendBulkEmails(@Request() req, @Body() body: BulkEmailDto) {
    const { email: userEmail } = req.user;
    const { emails, subject, text, attachments } = body;

    return this.leadService.sendBulkEmails(emails, subject, text, attachments);
  }

  @Post("uploadMultipleLeadFiles")
  @ApiOperation({
    summary: "Upload multiple lead files",
  })
  /**If things fail try using files[] */
  @UseInterceptors(FilesInterceptor("files[]"))
  @HttpCode(HttpStatus.OK)
  uploadMultipleLeadFiles(
    @Request() req,
    @Body() body: UploadMultipleFilesDto,
    @UploadedFiles() files
  ) {
    const { campaignName } = body;
    return this.leadService.uploadMultipleLeadFiles(files, campaignName);
  }

  @Post("saveAttachments")
  @ApiOperation({
    summary: "Upload multiple lead files",
  })
  @UseInterceptors(FilesInterceptor("files[]"))
  @HttpCode(HttpStatus.OK)
  saveEmailAttachments(
    @Request() req,
    @UploadedFiles() files
  ) {
    return this.leadService.saveEmailAttachments(files);
  }


  @Get(":leadId")
  @ApiOperation({
    summary: "Get lead by id",
  })
  @HttpCode(HttpStatus.OK)
  findOneById(
    @Param("leadId") leadId: string,
  ) {
    return this.leadService.findOneById(leadId);
  }
}
