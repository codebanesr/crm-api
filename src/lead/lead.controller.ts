import {
  Controller,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Body,
} from "@nestjs/common";
import {
  ApiOperation,
  ApiTags
} from "@nestjs/swagger";
import { LeadService } from "./lead.service";

@ApiTags('Lead')
@Controller("lead")
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post("findAll")
  @ApiOperation({ summary: "Fetches all lead for the given user" })
  @HttpCode(HttpStatus.OK)
  findAll(@Body() body, @Request() req) {
    const {
      page,
      perPage,
      sortBy = "createdAt",
      showCols,
      searchTerm,
      filters,
    } = body;

    const { email, roleType } = req.user;
    return this.leadService.findAll(
      page,
      perPage,
      sortBy,
      showCols,
      searchTerm,
      filters,
      email,
      roleType
    );
  }
}
