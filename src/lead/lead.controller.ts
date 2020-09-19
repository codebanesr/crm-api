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
  Query,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { LeadService } from "./lead.service";
import { FindAllDto } from "./dto/find-all.dto";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { GeoLocationDto } from "./dto/geo-location.dto";
import { ReassignLeadDto } from "./dto/reassign-lead.dto";
import { SyncCallLogsDto } from "./dto/sync-call-logs.dto";
import {
  CreateEmailTemplateDto,
  BulkEmailDto,
} from "./dto/create-email-template.dto";
import { FilesInterceptor } from "@nestjs/platform-express";
import { UploadMultipleFilesDto } from "./dto/generic.dto";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "../user/interfaces/user.interface";
import { Roles } from "src/auth/decorators/roles.decorator";

@ApiTags("Lead")
@Controller("lead")
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Get("getAllLeadColumns")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get lead by id",
  })
  getAllLeadColumns(@Query("campaignType") campaignType: string, @CurrentUser() user) {
    const {organization} = user;
    return this.leadService.getLeadColumns(campaignType, organization);
  }

  @Post("")
  @ApiOperation({ summary: "Fetches all lead for the given user" })
  @HttpCode(HttpStatus.OK)
  insertOne(@Body() body: CreateLeadDto, @CurrentUser() user: User) {
    const {organization, email} = user;
    return this.leadService.insertOne(body, email, organization);
  }

  @Post("findAll")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "Fetches all lead for the given user" })
  @HttpCode(HttpStatus.OK)
  findAll(@Body() body: FindAllDto, @CurrentUser() user) {
    const {
      page,
      perPage,
      sortBy = "createdAt",
      showCols,
      searchTerm,
      filters,
    } = body;


    const { email, roleType, organization } = user;
    return this.leadService.findAll(
      page,
      perPage,
      sortBy,
      showCols,
      searchTerm,
      filters,
      email,
      roleType,
      organization
    );
  }

  @Post("geoLocation")
  @ApiOperation({ summary: "Adds users location emitted from the device" })
  @HttpCode(HttpStatus.OK)
  addGeoLocation(@Body() body: GeoLocationDto, @CurrentUser() user) {
    const { lat, lng } = body;
    const { _id, organization } = user;
    return this.leadService.addGeolocation(_id, lat, lng, organization);
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
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "Adds users location emitted from the device" })
  @HttpCode(HttpStatus.OK)
  reassignLead(
    @Body() body: ReassignLeadDto,
    @CurrentUser() user: User,
    @Param("externalId") externalId: string
  ) {
    return this.leadService.reassignLead(
      user.email,
      body.oldUserEmail,
      body.newUserEmail,
      body.lead
    );
  }

  @Post("syncPhoneCalls")
  @ApiOperation({ summary: "Sync phone calls from device to database" })
  @HttpCode(HttpStatus.OK)
  syncPhoneCalls(@Body() callLogs: SyncCallLogsDto[], @CurrentUser() user: User) {
    const {organization, _id} = user;
    return this.leadService.syncPhoneCalls(callLogs, organization, _id);
  }

  @Get("getLeadHistoryById/:externalId")
  @ApiOperation({
    summary: "Get leads history by passing in external id of lead",
  })
  @HttpCode(HttpStatus.OK)
  getLeadHistoryById(@CurrentUser() user: User, @Param("externalId") externalId: string) {
    const {organization} = user;
    return this.leadService.getLeadHistoryById(externalId, organization);
  }

  @Get("user/performance")
  @ApiOperation({ summary: "Get users performance" })
  @HttpCode(HttpStatus.OK)
  getUsersPerformance(@Request() req) {
    return this.leadService.getPerformance();
  }

  @Get("suggest/:externalId")
  @ApiOperation({ summary: "Get users performance" })
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.OK)
  getLeadSuggestions(
    @CurrentUser() user: User,
    @Param("externalId") externalId: string,
    @Query("page") page: number = 1,
    @Query("perPage") perPage: number = 20
  ) {
    const {organization} = user;
    return this.leadService.suggestLeads(user.email, externalId, organization);
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
    @CurrentUser() user: User,
    @Query("limit") limit: number = 10,
    @Query("skip") skip: number = 0,
    @Query("campaign") campaign: string
  ) {
    const {organization} = user;
    return this.leadService.getAllEmailTemplates(
      limit || 20,
      skip || 0,
      campaign,
      organization
    );
  }

  @Post("createEmailTemplate")
  @ApiOperation({
    summary: "Create an email template to be used by agents",
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard("jwt"))
  createEmailTemplate(
    @CurrentUser() user: User,
    @Body() body: CreateEmailTemplateDto
  ) {
    const { email: userEmail, organization } = user;
    const { content, subject, campaign, attachments } = body;
    return this.leadService.createEmailTemplate(
      userEmail,
      content,
      subject,
      campaign,
      attachments,
      organization
    );
  }

  @Post("bulkEmail")
  @ApiOperation({
    summary: "Send Bulk Emails",
  })
  @HttpCode(HttpStatus.OK)
  sendBulkEmails(@Request() req, @Body() body: BulkEmailDto) {
    const { email: userEmail, organization } = req.user;
    const { emails, subject, text, attachments } = body;

    return this.leadService.sendBulkEmails(emails, subject, text, attachments, organization);
  }

  @Post("uploadMultipleLeadFiles")
  @ApiOperation({
    summary: "Upload multiple lead files",
  })
  /**If things fail try using files[] */
  @UseInterceptors(FilesInterceptor("files[]"))
  @HttpCode(HttpStatus.OK)
  uploadMultipleLeadFiles(
    @CurrentUser() user: User,
    @Body() body: UploadMultipleFilesDto,
    @UploadedFiles() files
  ) {

    /** @Todo add organization to lead file uploads also */
    const {email, organization} = user;
    const { campaignName } = body;
    return this.leadService.uploadMultipleLeadFiles(files, campaignName);
  }

  @Post("saveAttachments")
  @ApiOperation({
    summary: "Upload multiple lead files",
  })
  @UseInterceptors(FilesInterceptor("files[]"))
  @HttpCode(HttpStatus.OK)
  saveEmailAttachments(@UploadedFiles() files) {
    return this.leadService.saveEmailAttachments(files);
  }

  @Get(":leadId")
  @ApiOperation({
    summary: "Get lead by id",
  })
  @HttpCode(HttpStatus.OK)
  findOneById(@Param("leadId") leadId: string, @CurrentUser() user: User) {
    const {organization} = user;
    return this.leadService.findOneById(leadId, organization);
  }

  @Get("activity/:email")
  @ApiOperation({
    summary: "Get lead by id",
  })
  @HttpCode(HttpStatus.OK)
  leadActivityByUser(
    @Param("email") email: string,
    @Query("startDate") startDate: string,
    @Query("endDate") endDate: string
  ) {
    return this.leadService.leadActivityByUser(startDate, endDate, email);
  }

  // router.get("/fetchNextLead/:campaignId/:leadStatus", passportConfig.authenticateJWT, leadController.fetchNextLead);

  @Get("fetchNextLead/:campaignId/:leadStatus")
  @ApiOperation({
    summary:
      "Fetches next lead for telecaller operative, always returns one lead in that category, this has to be sorted by last updated at desc",
  })
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.OK)
  fetchNextLead(
    @CurrentUser() user: User,
    @Param("campaignId") campaignId: string,
    @Param("leadStatus") leadStatus: string
  ) {
    const {organization} = user;
    return this.leadService.fetchNextLead(campaignId, leadStatus, user.email, organization);
  }
}
