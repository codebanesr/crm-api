import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "../user/interfaces/user.interface";
import { GetGraphDataDto } from "./dto/get-graph-data.dto";
import { LeadAnalyticService } from "./lead-analytic.service";
@ApiTags("Lead Analytic")
@Controller("lead-analytic")
export class LeadAnalyticController {
  constructor(private analyticService: LeadAnalyticService) {}

  @Post("graphData")
  @ApiOperation({ summary: "Gets data for various types of graphs" })
  @UseGuards(AuthGuard("jwt"))
  async getGraphData(
    @CurrentUser() user: User,
    @Body() graphInput: GetGraphDataDto
  ) {
    const { organization } = user;
    return this.analyticService.getGraphData(organization, graphInput);
  }

  @Post("leadStatusLineData")
  @ApiOperation({
    summary:
      "gets count of lead by leadstatus and email, this will be represent on a line graph",
  })
  @UseGuards(AuthGuard("jwt"))
  @Roles("admin", "superAdmin")
  async getLeadStatusDataForLineGraph(
    @CurrentUser() user: User,
    @Body() graphFilter: GetGraphDataDto,
    @Query("year") year: string
  ) {
    const { email, organization } = user;
    return this.analyticService.getLeadStatusDataForLineGraph(
      email,
      organization,
      year
    );
  }

  @Get("openClosedLeadCount")
  @ApiOperation({
    summary:
      "Fetches total lead count in terms of open and closed lead for every user, this will be shown on a table",
  })
  @UseGuards(AuthGuard("jwt"))
  @Roles("admin", "superAdmin")
  async getLeadStatusCountForTelecallers(@CurrentUser() user: User) {
    const { email, organization } = user;
    return this.analyticService.getLeadStatusCountForTelecallers(
      email,
      organization
    );
  }

  @Post("campaignWiseLeadCount")
  @ApiOperation({
    summary: "Fetches total lead in each campaign and shows it on a bar chart",
  })
  @UseGuards(AuthGuard("jwt"))
  @Roles("admin", "superAdmin")
  async getCampaignWiseLeadCount(
    @CurrentUser() user: User,
    @Body() graphFilter: GetGraphDataDto
  ) {
    const { email, organization } = user;
    return this.analyticService.getCampaignWiseLeadCount(
      email,
      organization,
      graphFilter
    );
  }

  @Post("campaignWiseLeadCountPerCategory")
  @ApiOperation({
    summary:
      "Fetches total lead in each campaign by separated by category and shows it on a stack bar chart",
  })
  @UseGuards(AuthGuard("jwt"))
  @Roles("admin", "superAdmin")
  async getCampaignWiseLeadCountPerLeadCategory(
    @CurrentUser() user: User,
    @Body() graphFilter: GetGraphDataDto
  ) {
    const { email, organization } = user;
    return this.analyticService.getCampaignWiseLeadCountPerLeadCategory(
      email,
      organization,
      graphFilter
    );
  }

  @Post("userTalktime")
  @ApiOperation({
    summary:
      "Fetches individual users talktime and represents it in a bar graph",
  })
  @UseGuards(AuthGuard("jwt"))
  @Roles("admin", "superAdmin")
  async getUserTalktime(
    @CurrentUser() user: User,
    @Body() graphFilter: GetGraphDataDto
  ) {
    const { email, organization } = user;
    return this.analyticService.getUserTalktime(
      email,
      organization,
      graphFilter
    );
  }
}