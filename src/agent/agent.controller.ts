import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  Query,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AgentService } from "./agent.service";
import {Response} from "express";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { User } from "../user/interfaces/user.interface";
import { Roles } from "../auth/decorators/roles.decorator";

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
  getUsersPerformance(
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
  @HttpCode(HttpStatus.OK)
  downloadFile(
    @Res() res: Response,
    @Query("location") location: string,
  ) {
    this.agentService.downloadFile(location, res);
  }
}
