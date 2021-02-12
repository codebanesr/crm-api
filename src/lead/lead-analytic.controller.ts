import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
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
}