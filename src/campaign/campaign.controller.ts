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
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiConsumes } from "@nestjs/swagger";
import { CampaignService } from "./campaign.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { sortBy } from "lodash";
import { FindCampaignsDto } from "./dto/find-campaigns.dto";

@ApiTags("Campaign")
@Controller("campaign")
export class CampaignController {
  constructor(private campaignService: CampaignService) {}

  @Get("")
  @ApiOperation({ summary: "Fetches all lead for the given user" })
  @HttpCode(HttpStatus.OK)
  findAll(@Body() body: FindCampaignsDto) {
        const {filters, page, perPage, sortBy} = body;
      return this.campaignService.findAll(page, perPage, filters, sortBy)
  }

  @Get("disposition/:campaignId")
  @ApiOperation({ summary: "get disposition for campaign" })
  @HttpCode(HttpStatus.OK)
  getDispositionForCampaign(@Param('campaignId') campaignId: string) {
    this.campaignService.getDispositionForCampaign(campaignId);
  }

  @Get("autocomplete/suggestEmails")
  @ApiOperation({ summary: "Get list of emails for suggestion" })
  @HttpCode(HttpStatus.OK)
  getHandlerEmailHints(@Query('partialEmail') partialEmail: string) {
    return this.campaignService.getHandlerEmailHints(partialEmail);
  }

  @Get("autocomplete/suggestTypes")
  @ApiOperation({ summary: "Sends a list of suggestions for campaigns" })
  @HttpCode(HttpStatus.OK)
  getCampaignTypes(@Query('hint') hint: string) {
    return this.campaignService.getCampaignTypes(hint);
  }

  @Post("config/upload")
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Upload a campaign config file" })
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.OK)
  uploadConfig(@UploadedFile() file) {
    // file upload decorators required here
    return this.campaignService.uploadConfig(file);
  }

  @Get(":campaignId")
  @ApiOperation({ summary: "Get one campaign by id" })
  @HttpCode(HttpStatus.OK)
  findOneById(@Param('campaignId') campaignId: string) {
    return this.campaignService.findOneById(campaignId);
  }

  @Post("createCampaignAndDisposition")
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({
    summary: "Upload a campaign file and also send disposition data",
  })
  @HttpCode(HttpStatus.OK)
  createCampaignAndDisposition(
    @Request() req,
    @UploadedFile() file,
    @Body() body
  ) {
    const { id: activeUserId } = req.user;
    const { dispositionData, campaignInfo } = body;
    return this.campaignService.createCampaignAndDisposition(activeUserId, file, dispositionData, campaignInfo);
  }
}
