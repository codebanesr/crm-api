import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiCreatedResponse } from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { User } from "../user/interfaces/user.interface";
import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Post("leadStatus")
  @UseGuards(AuthGuard("jwt"))
  @Roles("admin")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: `Get aggregated Lead Status for a given date range,  kitne amount ka transaction fail hua, 
                    pass hua ya nurturing state me hai pie chart data `,
  })
  @ApiCreatedResponse({})
  async getLeadStatusByOrganization(
    @CurrentUser() user: User,
    @Body() body: any
  ) {
    const {organization} = user;
    const { dateArray } = body;
    return this.dashboardService.getAggregatedLeadStatus(organization, dateArray);
  }

  @Post("leadStatus/department")
  @UseGuards(AuthGuard("jwt"))
  @Roles("admin")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary:
      `Get aggregated Lead Status for the department this manager belongs top, 
                            This also accepts date filter in the form of array elements
                            Top 3 frontline with highest number of leads and leads in respective stages
      `,
  })
  @ApiCreatedResponse({})
  async getLeadStatusByDepartment(
    @CurrentUser() user: User,
    @Body() body: any
  ) {
    const {organization} = user;
    const { dateArray } = body;
    return this.dashboardService.getAggrgegatedLeadStatusForDepartment(
      organization,
      dateArray
    );
  }

  @Post("leadStatus/monthlyReport")
  @UseGuards(AuthGuard("jwt"))
  @Roles("admin")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Sends details about leads by week, month or cycle; new/lost/nurturing, input is the month, week and day calculation will be automatically done",
  })
  @ApiCreatedResponse({})
  async getLeadInfoByMonth(
    @CurrentUser() user: User,
    @Body() body: any
  ) {
    const {organization} = user;
    const { month } = body;
    return this.dashboardService.getLeadInfoByMonth(
      organization,
      month
    );
  }
}
