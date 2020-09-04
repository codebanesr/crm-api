import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  Query,
  Res,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AgentService } from "./agent.service";
import {Response} from "express";

@ApiTags("Agent")
@Controller("agent")
export class AgentController {
  constructor(private agentService: AgentService) {}

  @Get("listActions")
  @ApiOperation({ summary: "Get all admin actions" })
  @HttpCode(HttpStatus.OK)
  getUsersPerformance(
    @Request() req,
    @Query("skip") skip: number = 0,
    @Query("fileType") fileType: string,
    @Query("sortBy") sortBy: string = 'handler',
    @Query("me") me: boolean
  ) {
    const { id: activeUserId } = req.user;

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
