import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  Query,
  Res,
  UseGuards,
  Post,
  Body,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AgentService } from "./agent.service";
import {Response} from "express";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { User } from "../user/interfaces/user.interface";
import { Roles } from "../auth/decorators/roles.decorator";
import { BatteryStatusDto } from "./schemas/battery-status.dto";
import { AddLocationDto } from "./dto/add-location.dto";
import { GetUsersLocationsDto } from "./dto/get-user-locations.dto";

@ApiTags("Agent")
@Controller("agent")
@UseGuards(RolesGuard)
export class AgentController {
  constructor(private agentService: AgentService) {}

  @Get("listActions")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "List all admin actions" })
  @Roles('admin', 'manager')
  @HttpCode(HttpStatus.OK)
  async getUsersPerformance(
    @CurrentUser() user: User,
    @Query("skip") skip: number = 0,
    @Query("fileType") fileType: string,
    @Query("sortBy") sortBy: string = 'handler',
    @Query("me") me: boolean,
    @Query("campaign") campaign: string
  ) {
    const { id: activeUserId, organization } = user;

    /** remove aggregation and add stricter types using QueryParams and class validators */
    return this.agentService.listActions(
      activeUserId,
      organization,
      skip,
      fileType,
      sortBy,
      me,
      campaign
    );
  }

  @Get("download")
  @ApiOperation({ summary: "Get all admin actions" })
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.OK)
  async downloadFile(
    @Res() res: Response,
    @Query("location") location: string,
  ) {
    this.agentService.downloadFile(location, res);
  }


  @Post("batteryStatus")
  @ApiOperation({ summary: "Updates the battery status when it changes" })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard("jwt"))
  async batteryStatus(
    @Body() batLvl: BatteryStatusDto,
    @CurrentUser() user: User
  ) {

    const { _id } = user;
    return this.agentService.updateBatteryStatus(_id, batLvl);
  }



  @Post("visitTrack")
  @ApiOperation({ summary: "Update users visiting location" })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard("jwt"))
  async addVisitTrack(@CurrentUser() user: User, @Body() payload: AddLocationDto) {
    const {_id} = user;
    return this.agentService.addVisitTrack(_id, payload);
  }



  @Post("visitTrack/get")
  async getVisitTrack(@Body() body: GetUsersLocationsDto, @CurrentUser() user: User) {
    const { userIds } = body;
    const {email, organization, roleType} = user;
    return this.agentService.getVisitTrack(email, roleType, organization ,userIds);
  }
}
