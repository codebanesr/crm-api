import {
  Controller,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "src/auth/decorators/roles.decorator";
import {
  ApiOperation,
  ApiImplicitHeader,
  ApiOkResponse,
} from "@nestjs/swagger";
import { LeadService } from "./lead.service";

@Controller("lead")
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Get("data")
  @UseGuards(AuthGuard("jwt"))
  @Roles("admin")
  @ApiOperation({ title: "A private route for check the auth" })
  @ApiImplicitHeader({
    name: "Bearer",
    description: "the token we need for auth.",
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({})
  findAll() {
    return {name: "shanur"};
  }
}
