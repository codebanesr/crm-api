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
  Logger
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiConsumes } from "@nestjs/swagger";
import { CampaignService } from "./campaign.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { sortBy } from "lodash";
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
  // @UsePipes(new ValidationPipe({transform: true}))
  findAll(@Body() body: FindCampaignsDto) {
        const {filters, page, perPage, sortBy} = body;
      return this.campaignService.findAll(page, perPage, filters, sortBy)
  }

  @Get("disposition/:campaignId")
  @ApiOperation({ summary: "Gets the latest version of disposition from all disposition trees added with campaign" })
  @HttpCode(HttpStatus.OK)
  getDispositionForCampaign(@Param('campaignId') campaignId: string) {
    return this.campaignService.getDispositionForCampaign(campaignId);
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
  @UseGuards(AuthGuard('jwt'))
  getCampaignTypes(@Query('hint') hint: string, @CurrentUser() user: User) {
    const {organization} = user;
    return this.campaignService.getCampaignTypes(hint, organization);
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
  @CacheTTL(300)
  findOneByIdOrName(@Param('campaignId') campaignId: string, @Query('identifier') identifier: string) {
    return this.campaignService.findOneByIdOrName(campaignId, identifier);
  }

  @Post("createCampaignAndDisposition")
  @UseGuards(AuthGuard('jwt'))
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
    const { id: activeUserId } = currrentUser;
    const { dispositionData, campaignInfo } = body;
    return this.campaignService.createCampaignAndDisposition(activeUserId, file, dispositionData, campaignInfo);
  }
}
