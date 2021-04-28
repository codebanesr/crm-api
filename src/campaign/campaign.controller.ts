import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Patch,
  Delete,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiConsumes } from "@nestjs/swagger";
import { CampaignService } from "./campaign.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { assign, sortBy } from "lodash";
import { FindCampaignsDto } from "./dto/find-campaigns.dto";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "../user/interfaces/user.interface";
import { UpdateConfigsDto } from "./dto/update-configs.dto";
import { CreateCampaignAndDispositionDto } from "./dto/create-campaign-disposition.dto";
import { Roles } from "../auth/decorators/roles.decorator";
import { RoleType } from "../shared/role-type.enum";
import { DeleteCampaignConfigDto } from "./dto/delete-campaignConfig.dto";
import { DcaeDto } from "./dto/dcae.dto";

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
    const { _id: loggedInUserId, organization, roles } = user;
    const { filters, page, perPage, sortBy } = body;
    return this.campaignService.findAll({
      page,
      perPage,
      filters,
      sortBy,
      loggedInUserId,
      organization,
      roles
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
    @Param("campaignId") campaignId: string
  ) {
    return this.campaignService.findOneByIdOrName(campaignId);
  }

  @Roles("superAdmin")
  @Get("organization/:organizationId")
  getCampaignsForOrganization(@Param('organizationId') organizationId: string) {
    return this.campaignService.getCampaignsForOrganization(organizationId);
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
    @Body() body: CreateCampaignAndDispositionDto
  ) {
    const { id: activeUserId, organization } = currrentUser;
    return this.campaignService.createCampaignAndDisposition({...body, activeUserId, organization});
  }

  // @Get("disposition/campaignName/:campaignName")
  // @ApiOperation({ summary: "Get disposition By Campaign Name" })
  // @HttpCode(HttpStatus.OK)
  // @UseGuards(AuthGuard("jwt"))
  // getDispositionByCampaignName(
  //   @Param("campaignName") campaignName: string,
  //   @CurrentUser() user: User
  // ) {
  //   const { organization } = user;
  //   return this.campaignService.getDispositionByCampaignName(
  //     campaignName,
  //     organization
  //   );
  // }

  @Delete("archive/:id")
  @ApiOperation({ summary: "Archives a campaign" })
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.OK)
  archiveCampaign(@CurrentUser() user: User, @Param('id') campaignId: string) {
    const { organization } = user;
    return this.campaignService.archiveCampaign(organization, campaignId);
  }

  @Patch("addConfigs/:campaignId/:campaignName")
  @ApiOperation({ summary: "Adds configuration to existing campaign" })
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.OK)
  updateConfigs(
      @CurrentUser() user: User, 
      @Body() configs: UpdateConfigsDto,
      @Param('campaignId') campaignId: string, 
      @Param('campaignName') campaignName: string
    ) {
    const { organization } = user;
    return this.campaignService.updateConfigs(configs, organization, campaignId, campaignName);
  }

  @Post("delete/config")
  @ApiOperation({ summary: "Deletes single config from campaign configs schema" })
  @UseGuards(AuthGuard("jwt"))
  @Roles("admin")
  @HttpCode(HttpStatus.ACCEPTED)
  deleteConfig(@Body() deleteConfigDto: DeleteCampaignConfigDto) {
    return this.campaignService.deleteConfig(deleteConfigDto);
  }

  @Post("clone")
  @ApiOperation({ summary: "Creates a clone of the campaign whose id has been provided" })
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.OK)
  @Roles(RoleType.admin)
  cloneCampaign(@CurrentUser() user, @Body() body: {campaignId: string}) {
    const { campaignId } = body;
    return this.campaignService.cloneCampaign(campaignId);
  }


  @Post("deleteCampaignAndAllAssociatedEntities")
  @UseGuards(AuthGuard("jwt"))
  @Roles(RoleType.superAdmin)
  @ApiOperation({ summary: "Deletes campaign and all associated attributes of campaign" })
  @HttpCode(HttpStatus.OK)
  // @Roles(RoleType.superAdmin)
  deleteCampaignAndAllAssociatedEntities(@Body() dcAE: DcaeDto) {
    return this.campaignService.deleteCampaignAndAllAssociatedEntities(dcAE);
  }
}
// PATCH /campaign/addConfigs/5f49637c37c8e231c6711b36/spec-v4