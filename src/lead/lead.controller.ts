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
  PreconditionFailedException,
  Res,
  Logger,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { LeadService } from "./lead.service";
import { FindAllDto } from "./dto/find-all.dto";
import { UpdateLeadDto } from "./dto/update-lead.dto";
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
import { Roles } from "../auth/decorators/roles.decorator";
import { UserActivityDto } from "../user/dto/user-activity.dto";
import { FollowUpDto } from "./dto/follow-up.dto";
import { FetchNextLeadDto } from "./dto/fetch-next-lead.dto";
import { UpdateContactDto } from "./dto/update-contact.dto";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { GetTransactionDto } from "./dto/get-transaction.dto";
import { utils, writeFile, WritingOptions } from "xlsx";
import { createReadStream } from "fs";
import { Response } from "express";

@ApiTags("Lead")
@Controller("lead")
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Get("getAllLeadColumns/:campaignId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get lead by id",
  })
  @UseGuards(AuthGuard("jwt"))
  getAllLeadColumns(
    @Param("campaignId") campaignId: string,
    @Query('remove') remove: string[] = [],
    @CurrentUser() user
  ) {
    Logger.debug(remove);
    return this.leadService.getLeadColumns(campaignId, remove);
  }

  /** @Todo to replace campaignName with campaignId */
  @Post("/create/:campaignId/:campaignName")
  @ApiOperation({ summary: "Creates New Lead" })
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.OK)
  insertOne(
    @Body() body: CreateLeadDto,
    @CurrentUser() user: User,
    @Param("campaignId") campaignId: string,
    @Param("campaignName") campaignName: string
  ) {
    const { organization, email } = user;
    return this.leadService.createLead(
      body,
      email,
      organization,
      campaignId,
      campaignName
    );
    // return this.leadService.insertOne(body, email, organization, campaignId);
  }


  /**
   * 
   * @param user User
   * @param body GetTransationDto
   * who can see these transactions - one who is assigned, his managers or admin
   */
  @Post("transactions")
  @UseGuards(AuthGuard("jwt"))
  async getTransactions(
      @CurrentUser() user: User, 
      @Body() body: GetTransactionDto, 
      @Query('isStreamable') isStreamable: boolean,
      @Res() res: Response
    ) {
    const { organization, email, roleType } = user;

    const {response, total} = await this.leadService.getTransactions(organization, email, roleType, body, isStreamable);
    if(!isStreamable) {
      return res.status(200).send({response, total});
    }

    // convert to excel sheet and pipe the response to the frontend
    if(isStreamable) {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats');
      res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");

      const wb = utils.book_new();                     // create workbook
      /** @Todo too computationally intensive, to be replaced by mongoose */
      const ws = utils.json_to_sheet(JSON.parse(JSON.stringify(response)));
      utils.book_append_sheet(wb, ws, 'transactions');  // add sheet to workbook

      const filename = "transactions.xlsx";
      const wb_opts: WritingOptions = {bookType: 'xlsx', type: 'binary'};   // workbook options
      writeFile(wb, filename, wb_opts);                // write workbook file

      const stream = createReadStream(filename);         // create read stream
      stream.pipe(res);     
      stream.on("close", () => {
        return res.end();
      });
    }
  }

  @Post("findAll")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "Fetches all lead for the given user" })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard("jwt"))
  findAll(@Body() body: FindAllDto, @CurrentUser() user) {
    const {
      page,
      perPage,
      sortBy = "createdAt",
      showCols,
      searchTerm,
      filters,
      typeDict,
      campaignId
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
      organization,
      typeDict,
      campaignId
    );
  }

  @Post("geoLocation")
  @ApiOperation({ summary: "Adds users location emitted from the device" })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard("jwt"))
  addGeoLocation(@Body() body: GeoLocationDto, @CurrentUser() user) {
    const { lat, lng } = body;
    const { _id, organization } = user;
    return this.leadService.addGeolocation(_id, lat, lng, organization);
  }

  @Put(":id")
  @ApiOperation({ summary: "Adds users location emitted from the device" })
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.OK)
  updateLead(
    @CurrentUser() user: User,
    @Body() updateLeadObj: UpdateLeadDto,
    @Param("id") leadId: string
  ) {
    const { organization, email: handlerEmail, fullName: handlerName } = user;

    return this.leadService.updateLead(
      {...updateLeadObj, leadId, organization, handlerEmail, handlerName}
    );
  }

  @Put("contact/:leadId")
  @ApiOperation({ summary: "Adds contact information" })
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.OK)
  addContact(@Body() body: UpdateContactDto, @Param("leadId") leadId: string) {
    return this.leadService.addContact(body, leadId);
  }

  @Post("reassignLead")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "Adds users location emitted from the device" })
  @HttpCode(HttpStatus.OK)
  reassignLead(
    @Body() body: ReassignLeadDto,
    @CurrentUser() user: User,
  ) {
    return this.leadService.reassignLead(
      user.email,
      body.oldUserEmail,
      body.newUserEmail,
      body.lead
    );
  }

  // @Post("syncPhoneCalls/:leadId")
  // @UseGuards(AuthGuard("jwt"))
  // @ApiOperation({ summary: "Sync phone calls from device to database" })
  // @HttpCode(HttpStatus.OK)
  // syncPhoneCalls(
  //   @Param('leadId') leadId: string,
  //   @Body() callLogs: SyncCallLogsDto,
  //   @CurrentUser() user: User
  // ) {
  //   const { organization, _id: agentId } = user;
  //   return this.leadService.syncPhoneCalls(callLogs, organization, agentId, leadId);
  // }

  @Get("getLeadHistoryById/:externalId")
  @ApiOperation({
    summary: "Get leads history by passing in external id of lead",
  })
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.OK)
  getLeadHistoryById(
    @CurrentUser() user: User,
    @Param("externalId") externalId: string
  ) {
    const { organization } = user;
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
    const { organization } = user;
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
  @UseGuards(AuthGuard("jwt"))
  getAllEmailTemplates(
    @CurrentUser() user: User,
    @Query("limit") limit: number = 10,
    @Query("skip") skip: number = 0,
    @Query("campaignId") campaignId: string
  ) {
    const { organization } = user;
    return this.leadService.getAllEmailTemplates(
      limit || 20,
      skip || 0,
      campaignId,
      organization
    );
  }

  @Post("createEmailTemplate")
  @UseGuards(AuthGuard("jwt"))
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
    const { content, subject, campaignId, attachments, templateName } = body;
    return this.leadService.createEmailTemplate(
      userEmail,
      content,
      subject,
      campaignId,
      attachments,
      organization,
      templateName
    );
  }

  @Post("bulkEmail")
  @ApiOperation({
    summary: "Send Bulk Emails",
  })
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.OK)
  sendBulkEmails(@Request() req, @Body() body: BulkEmailDto) {
    const { email: userEmail, organization } = req.user;
    const { emails, subject, text, attachments } = body;

    return this.leadService.sendBulkEmails(
      emails,
      subject,
      text,
      attachments,
      organization
    );
  }

  @Post("uploadMultipleLeadFiles")
  @ApiOperation({
    summary: "Upload multiple lead files",
  })
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.OK)
  uploadMultipleLeadFiles(
    @CurrentUser() user: User,
    @Body() body: UploadMultipleFilesDto
  ) {
    /** @Todo add organization to lead file uploads also */
    const { email, organization, _id, pushtoken } = user;
    const { campaignName, files, campaignId } = body;
    return this.leadService.uploadMultipleLeadFiles(
      files,
      campaignName,
      email,
      organization,
      _id,
      pushtoken,
      campaignId
    );
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
  @UseGuards(AuthGuard("jwt"))
  findOneById(@Param("leadId") leadId: string, @CurrentUser() user: User) {
    const { email, roleType } = user;
    return this.leadService.findOneById(leadId, email, roleType);
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

  @Post("fetchNextLead/:campaignId")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({
    summary:
      "Fetches next lead for telecaller operative, always returns one lead in that category, this has to be sorted by last updated at desc",
  })
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.OK)
  fetchNextLead(
    @CurrentUser() user: User,
    @Param("campaignId") campaignId: string,
    @Body() body: FetchNextLeadDto
  ) {
    const { organization, email, roleType } = user;
    const { filters, typeDict, nonKeyFilters } = body;
    return this.leadService.fetchNextLead({
      campaignId,
      filters,
      email,
      organization,
      typeDict,
      roleType,
      nonKeyFilters
    });
  }

  @Post("alarms/getAll")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({
    summary: "Gets all alarms generated for a user in an organization",
  })
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.OK)
  getAllAlarms(@CurrentUser() user: User, @Body() body: any) {
    const { organization } = user;
    return this.leadService.getAllAlarms(body, organization);
  }

  @Post("/activity/logs")
  @UseGuards(AuthGuard("jwt"))
  @Roles("admin")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Register user" })
  async usersActivityLog(
    @Body() userActivityDto: UserActivityDto,
    @CurrentUser() user: User
  ) {
    const { organization } = user;
    const { dateRange, userEmail } = userActivityDto;
    return this.leadService.getUsersActivity(
      dateRange,
      userEmail,
      organization
    );
  }

  @Post("/followUp")
  @UseGuards(AuthGuard("jwt"))
  @Roles("admin")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Register user" })
  async fetchFollowUps(
    @Body() followUpDto: FollowUpDto,
    @CurrentUser() user: User
  ) {
    const { organization } = user;
    const {
      interval,
      userEmail,
      campaignName,
      page,
      perPage,
    } = followUpDto;

    await this.leadService.checkPrecondition(user, userEmail);

    const limit = Number(perPage);
    const skip = Number((+page - 1) * limit);
    return this.leadService.getFollowUps({
      interval,
      organization,
      email: userEmail || user.email,
      campaignName,
      limit,
      page,
      skip,
    });
  }
}
