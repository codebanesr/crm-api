import { Roles } from "./../auth/decorators/roles.decorator";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { LoginUserDto } from "./dto/login-user.dto";

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Query,
  Request,
  UseInterceptors,
  UploadedFile,
  Get
} from "@nestjs/common";
import { Request as IRequest } from 'express';
import { CreateUserDto } from "./dto/create-user.dto";
import { VerifyUuidDto } from "./dto/verify-uuid.dto";
import { UserService } from "./user.service";
import { AuthGuard, PassportModule } from "@nestjs/passport";
import { RefreshAccessTokenDto } from "./dto/refresh-access-token.dto";
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";
import { RolesGuard } from "../auth/guards/roles.guard";
import {FileInterceptor} from "@nestjs/platform-express";
import { FileUploadDto } from "./dto/fileUpload.dto";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "./interfaces/user.interface";
import { FindAllDto } from "../lead/dto/find-all.dto";
import { CreateForgotPasswordDto } from "./dto/create-forgot-password.dto";

@ApiTags("User")
@Controller("user")
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ╔═╗╦ ╦╔╦╗╦ ╦╔═╗╔╗╔╔╦╗╦╔═╗╔═╗╔╦╗╔═╗
  // ╠═╣║ ║ ║ ╠═╣║╣ ║║║ ║ ║║  ╠═╣ ║ ║╣
  // ╩ ╩╚═╝ ╩ ╩ ╩╚═╝╝╚╝ ╩ ╩╚═╝╩ ╩ ╩ ╚═╝
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Register user" })
  @ApiCreatedResponse({})
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }


  @Get()
  @ApiOperation({ summary: "Get users hack" })
  async getAllUsersHack() {
    return await this.userService.getAllUsersHack();
  }


  @Post("verify-email")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verify Email" })
  @ApiOkResponse({})
  async verifyEmail(@Req() req: IRequest, @Body() verifyUuidDto: VerifyUuidDto) {
    return await this.userService.verifyEmail(req, verifyUuidDto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login User" })
  @ApiOkResponse({})
  async login(@Req() req: IRequest, @Body() loginUserDto: LoginUserDto) {
    return await this.userService.login(req, loginUserDto);
  }

  @Post("refresh-access-token")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Refresh Access Token with refresh token" })
  @ApiCreatedResponse({})
  async refreshAccessToken(
    @Body() refreshAccessTokenDto: RefreshAccessTokenDto
  ) {
    return await this.userService.refreshAccessToken(refreshAccessTokenDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'Forgot password',})
  @ApiOkResponse({})
  async forgotPassword(@Req() req: IRequest, @Body() createForgotPasswordDto: CreateForgotPasswordDto) {
      return await this.userService.forgotPassword(req, createForgotPasswordDto);
  }

  @Post("forgot-password-verify")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verfiy forget password code" })
  @ApiOkResponse({})
  async forgotPasswordVerify(
    @Req() req: IRequest,
    @Body() verifyUuidDto: VerifyUuidDto
  ) {
    return await this.userService.forgotPasswordVerify(req, verifyUuidDto);
  }

  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Reset password after verify reset password" })
  @ApiBearerAuth()
  @ApiHeader({
    name: "Bearer",
    description: "the token we need for auth.",
  })
  @ApiOkResponse({})
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.userService.resetPassword(resetPasswordDto);
  }

  @Get("allUsers")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "Gets all users" })
  @ApiHeader({
    name: "Bearer",
    description: "the token we need for auth.",
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({})
  findAll(
    @CurrentUser() user: User, 
    @Query("assigned") assigned: string,
    @Body() findAllDto: FindAllDto
  ) {
    return this.userService.getAll(user, assigned, findAllDto);
  }

  @Get("managersForReassignment")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "Gets all users" })
  @ApiHeader({
    name: "Bearer",
    description: "the token we need for auth.",
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({})
  managersForReassignment(
    @CurrentUser() user: User, 
    @Query("assigned") assigned: string,
  ) {
    return this.userService.managersForReassignment(user.manages);
  }




  @Post("many")
  @UseGuards(AuthGuard("jwt"))
  @Roles("user")
  @ApiOperation({ summary: "Add users in bulk from excel file" })
  @ApiHeader({
    name: "Bearer",
    description: "the token we need for auth.",
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of Users',
    type: FileUploadDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({})
  @UseInterceptors(FileInterceptor('file'))
  add(@Request() req: any, @Query("assigned") assigned: string, @UploadedFile() file) {
    return this.userService.insertMany(req.user.id, file.path);
  }
}