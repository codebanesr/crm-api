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
  Get,
  Param,
  Logger,
  Put,
} from "@nestjs/common";
import { Request as IRequest } from "express";
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
import { FileInterceptor } from "@nestjs/platform-express";
import { FileUploadDto } from "./dto/fileUpload.dto";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "./interfaces/user.interface";
import { FindAllDto } from "../lead/dto/find-all.dto";
import { CreateForgotPasswordDto } from "./dto/create-forgot-password.dto";
import { UserActivityDto } from "./dto/user-activity.dto";
import { PushNotificationDto } from "./dto/push-notification.dto";
import { CreateResellerDto } from "./dto/create-reseller.dto";

@ApiTags("User")
@Controller("user")
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ╔═╗╦ ╦╔╦╗╦ ╦╔═╗╔╗╔╔╦╗╦╔═╗╔═╗╔╦╗╔═╗
  // ╠═╣║ ║ ║ ╠═╣║╣ ║║║ ║ ║║  ╠═╣ ║ ║╣
  // ╩ ╩╚═╝ ╩ ╩ ╩╚═╝╝╚╝ ╩ ╩╚═╝╩ ╩ ╩ ╚═╝
  @Post()
  @UseGuards(AuthGuard("jwt"))
  @Roles("admin")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Registers user/admin" })
  @ApiCreatedResponse({})
  async register(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() user: User
  ) {
    // liu -> logged in user
    const { organization } = user;
    return this.userService.create(createUserDto, organization);
  }


  @Post("reseller")
  @UseGuards(AuthGuard("jwt"))
  @Roles("superadmin")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Registers user/admin/reseller" })
  @ApiCreatedResponse({})
  async registerReseller(
    @Body() createResellerDto: CreateResellerDto,
    @CurrentUser() user: User
  ) {
    return this.userService.createReseller(createResellerDto);
  }

  @Get()
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "Gets all users without filter, quick prototype" })
  @ApiOperation({ summary: "Get users hack" })
  async getAllUsersHack(@CurrentUser() user: User) {
    const { organization } = user;
    return this.userService.getAllUsersHack(organization);
  }

  @Get("single/:id")
  @Roles("admin")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "Gets single user details" })
  async getUserById(@CurrentUser() user: User, @Param("id") userid: string) {
    const { organization } = user;
    return this.userService.getUserById(userid, organization);
  }

  @Post("verify-email")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verify Email" })
  @ApiOkResponse({})
  async verifyEmail(
    @Req() req: IRequest,
    @Body() verifyUuidDto: VerifyUuidDto
  ) {
    return this.userService.verifyEmail(req, verifyUuidDto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login User" })
  @ApiOkResponse({})
  async login(@Req() req: IRequest, @Body() loginUserDto: LoginUserDto) {
    return this.userService.login(req, loginUserDto);
  }

  @Post("refresh-access-token")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Refresh Access Token with refresh token" })
  @ApiCreatedResponse({})
  async refreshAccessToken(
    @Body() refreshAccessTokenDto: RefreshAccessTokenDto
  ) {
    return this.userService.refreshAccessToken(refreshAccessTokenDto);
  }

  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Forgot password" })
  @ApiOkResponse({})
  async forgotPassword(
    @Req() req: IRequest,
    @Body() createForgotPasswordDto: CreateForgotPasswordDto
  ) {
    return this.userService.forgotPassword(req, createForgotPasswordDto);
  }

  @Post("forgot-password-verify")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verfiy forget password code" })
  @ApiOkResponse({})
  async forgotPasswordVerify(
    @Req() req: IRequest,
    @Body() body: VerifyUuidDto
  ) {
    return this.userService.forgotPasswordVerify(req, body);
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
    return this.userService.resetPassword(resetPasswordDto);
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
    const { organization } = user;
    return this.userService.getAll(user, assigned, findAllDto, organization);
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
    @Query("assigned") assigned: string
  ) {
    const { organization } = user;
    return this.userService.managersForReassignment(user.manages, organization);
  }

  @Post("many")
  @UseGuards(AuthGuard("jwt"))
  @Roles("user")
  @ApiOperation({ summary: "Add users in bulk from excel file" })
  @ApiHeader({
    name: "Bearer",
    description: "the token we need for auth.",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "List of Users",
    type: FileUploadDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({})
  @UseInterceptors(FileInterceptor("file"))
  add(
    @Request() req: any,
    @Query("assigned") assigned: string,
    @UploadedFile() file,
    @CurrentUser() user: User
  ) {
    const { organization } = user;
    return this.userService.insertMany(req.user.id, file.path);
  }

  @Put(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Reset password after verify reset password" })
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Roles("admin")
  @ApiHeader({
    name: "Bearer",
    description: "the token we need for auth.",
  })
  @ApiOkResponse({})
  async updateUser(@Param("id") userid: string, @Body() user: CreateUserDto) {
    return this.userService.updateUser(userid, user);
  }

  // push notifications
  @Post("/subscribe/push")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Subscribe to push notification" })
  @UseGuards(AuthGuard("jwt"))
  @ApiOkResponse({})
  async subscribeToPush(
    @CurrentUser() user: User,
    @Body() body: PushNotificationDto
  ) {
    const { _id } = user;
    return this.userService.subscribeToPushNotification(_id, body);
  }

  @Post("/send/push")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "send push notifications to subscribed users" })
  @UseGuards(AuthGuard("jwt"))
  @ApiOkResponse({})
  async sendPushNotification(
    @Req() req: IRequest,
    @Body() body: VerifyUuidDto
  ) {
    return this.userService.sendPushNotification();
  }
}
