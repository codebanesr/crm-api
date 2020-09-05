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
import { User } from "src/user/interfaces/user.interface";

@ApiTags("Agent")
@Controller("agent")
@UseGuards(RolesGuard)
export class AgentController {
  constructor(private agentService: AgentService) {}

  @Get("listActions")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "List all admin actions" })
  @HttpCode(HttpStatus.OK)
  getUsersPerformance(
    @CurrentUser() user: User,
    @Query("skip") skip: number = 0,
    @Query("fileType") fileType: string,
    @Query("sortBy") sortBy: string = 'handler',
    @Query("me") me: boolean
  ) {
    const { id: activeUserId } = user;

    return this.agentService.listActions(
      activeUserId,
      skip,
      fileType,
      sortBy,
      me
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
