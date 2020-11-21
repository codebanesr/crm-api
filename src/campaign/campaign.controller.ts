import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  Post,
  Request,
  Body,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
  CacheKey,
  CacheTTL,
  UseGuards,
  Logger,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiConsumes } from "@nestjs/swagger";
import { CampaignService } from "./campaign.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { assign, sortBy } from "lodash";
import { FindCampaignsDto } from "./dto/find-campaigns.dto";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "../user/interfaces/user.interface";

@ApiTags("Campaign")
@Controller("campaign")
export class CampaignController {
  constructor(private campaignService: CampaignService) {}

  @Post("get")
  @ApiOperation({ summary: "Fetches all lead for the given user" })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard("jwt"))
  // @UsePipes(new ValidationPipe({transform: true}))
  findAll(@Body() body: FindCampaignsDto, @CurrentUser() user: User) {
    const { _id: loggedInUserId, organization } = user;
    const { filters, page, perPage, sortBy } = body;
    return this.campaignService.findAll({
      page,
      perPage,
      filters,
      sortBy,
      loggedInUserId,
      organization,
    });
  }

  @Get("disposition/:campaignId")
  @ApiOperation({
    summary:
      "Gets the latest version of disposition from all disposition trees added with campaign",
  })
  @HttpCode(HttpStatus.OK)
  getDispositionForCampaign(@Param("campaignId") campaignId: string) {
    return this.campaignService.getDispositionForCampaign(campaignId);
  }

  @Get("autocomplete/suggestEmails")
  @ApiOperation({ summary: "Get list of emails for suggestion" })
  @HttpCode(HttpStatus.OK)
  getHandlerEmailHints(@Query("partialEmail") partialEmail: string) {
    return this.campaignService.getHandlerEmailHints(partialEmail);
  }

  @Get("autocomplete/suggestTypes")
  @ApiOperation({ summary: "Sends a list of suggestions for campaigns" })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard("jwt"))
  getCampaignTypes(@Query("hint") hint: string, @CurrentUser() user: User) {
    const { organization } = user;
    return this.campaignService.getCampaignTypes(hint, organization);
  }

  @Post("config/upload")
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Upload a campaign config file" })
  @ApiConsumes("multipart/form-data")
  @HttpCode(HttpStatus.OK)
  uploadConfig(@UploadedFile() file) {
    // file upload decorators required here
    return this.campaignService.uploadConfig(file);
  }

  @Post("/campaignForm")
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Upload a campaign config file" })
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.OK)
  createCampaignForm(@CurrentUser() user: User, @Body() body) {
    const { organization } = user;
    const { payload, campaign } = body;
    return this.campaignService.updateCampaignForm({
      payload,
      organization,
      campaign,
    });
  }

  @Get(":campaignId")
  @ApiOperation({ summary: "Get one campaign by id" })
  @HttpCode(HttpStatus.OK)
  findOneByIdOrName(
    @Param("campaignId") campaignId: string,
    @Query("identifier") identifier: string
  ) {
    return this.campaignService.findOneByIdOrName(campaignId, identifier);
  }

  @Post("createCampaignAndDisposition")
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(FileInterceptor("campaignFile"))
  @ApiOperation({
    summary: "Upload a campaign file and also send disposition data",
  })
  @HttpCode(HttpStatus.OK)
  createCampaignAndDisposition(
    @CurrentUser() currrentUser: User,
    @UploadedFile() file,
    @Body() body
  ) {
    const { id: activeUserId, organization } = currrentUser;
    const {
      dispositionData,
      campaignInfo,
      editableCols,
      browsableCols,
      uniqueCols,
      formModel,
      assignTo,
      advancedSettings,
      groups
    } = body;

    return this.campaignService.createCampaignAndDisposition({
      activeUserId,
      file,
      dispositionData,
      campaignInfo,
      organization,
      editableCols,
      browsableCols,
      formModel,
      uniqueCols,
      assignTo,
      advancedSettings,
      groups
    });
  }

  @Get("disposition/campaignName/:campaignName")
  @ApiOperation({ summary: "Get disposition By Campaign Name" })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard("jwt"))
  @CacheTTL(300)
  getDispositionByCampaignName(
    @Param("campaignName") campaignName: string,
    @CurrentUser() user: User
  ) {
    const { organization } = user;
    return this.campaignService.getDispositionByCampaignName(
      campaignName,
      organization
    );
  }

  @Post("/archive")
  @ApiOperation({ summary: "Archives a campaign" })
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.OK)
  archiveCampaign(@CurrentUser() user: User, @Body() body) {
    const { organization } = user;
    return this.campaignService.archiveCampaign(body);
  }
}
