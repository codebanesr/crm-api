import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
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
    constructor(
        private analyticService: LeadAnalyticService
    ) {}


    @Post('graphData')
    @ApiOperation({ summary: "Gets data for various types of graphs" })
    @UseGuards(AuthGuard("jwt"))
    async getGraphData(@CurrentUser() user: User, @Body() graphInput: GetGraphDataDto) {
        const { organization } = user;
        const { handler } = graphInput;
        return this.analyticService.getGraphData(organization, handler);
    }


    @Get('leadStatusLineData')
    @ApiOperation({summary: "Fetches lead status data for plotting a line graph"})
    @UseGuards(AuthGuard("jwt"))
    @Roles('admin', 'superAdmin')
    async getLeadStatusDataForLineGraph(@CurrentUser() user: User, @Query('year') year: string) {
        const {email, organization} = user;
        return this.analyticService.getLeadStatusDataForLineGraph(email, organization,  year);
    }
}