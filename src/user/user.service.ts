import { ResetPasswordDto } from "./dto/reset-password.dto";
import { AuthService } from "./../auth/auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import {
  Injectable,
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  MethodNotAllowedException,
  PreconditionFailedException,
  UnauthorizedException,
  NotAcceptableException,
  BadGatewayException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DocumentDefinition, Model, Types } from "mongoose";
import { v4 } from "uuid";
import { addHours } from "date-fns";
import * as bcrypt from "bcryptjs";
import { CreateUserDto } from "./dto/create-user.dto";
import { VerifyUuidDto } from "./dto/verify-uuid.dto";
import { RefreshAccessTokenDto } from "./dto/refresh-access-token.dto";
import { ForgotPassword } from "./interfaces/forgot-password.interface";
import { User } from "./interfaces/user.interface";
import { CreateForgotPasswordDto } from "./dto/create-forgot-password.dto";
import { Request } from "express";
import parseExcel from "../utils/parseExcel";
import { AdminAction } from "../agent/interface/admin-actions.interface";
import { FindAllDto } from "../lead/dto/find-all.dto";
import { writeFile, utils } from "xlsx";
import { join } from "path";
import { default as config } from "../config/config";
import { createTransport } from "nodemailer";
import { getForgotPasswordTemplate } from "../utils/forgot-password-template";
import { PushNotificationDto } from "./dto/push-notification.dto";
import { CreateResellerDto } from "./dto/create-reseller.dto";
import { hashPassword } from "../utils/crypto.utils";
import { v4 as uuidv4 } from 'uuid';
import { RoleType } from "../shared/role-type.enum";
import { Organization } from "../organization/interface/organization.interface";
import { UpdateProfileDto } from "./dto/updateProfile.dto";
import * as moment from "moment";
import { OAuthDto } from './dto/oauth.dto';
import { OAuth2Client } from 'google-auth-library';
import { SharedService } from "../shared/shared.service";
const oauth2Client = new OAuth2Client(config.oauth.google.clientId);

@Injectable()
export class UserService {
  HOURS_TO_VERIFY = 4;
  HOURS_TO_BLOCK = 6;
  LOGIN_ATTEMPTS_TO_BLOCK = 5;

  constructor(
    @InjectModel("User") 
    private readonly userModel: Model<User>,

    @InjectModel("ForgotPassword")
    private readonly forgotPasswordModel: Model<ForgotPassword>,

    @InjectModel("AdminAction")
    private readonly adminActionModel: Model<AdminAction>,

    @InjectModel("Organization")
    private readonly organizationModel: Model<Organization>,

    private readonly authService: AuthService,

    private readonly sharedService: SharedService
  ) {}


  async oauthLogin(userDto: OAuthDto, req) {
    switch (userDto.provider) {
      case 'GOOGLE': {
        const payload = await this.verifyGoogleOauth(userDto.idToken);
        if (!payload.email) {
          throw new BadGatewayException("user email was not provided from oauth, please contact admin");
        }

        /** @Todo fix the part where he is part of multiple organizations */
        const user = await this.userModel.findOne({ email: payload.email });
        if (user) {
          return this.getLoginDetails(req, user, this.setSingleLoginKey(user));
        } else if(!user) {
          const password = uuidv4();
          const { user: newUser, organization } = await this.sharedService.createOrganization({
            email: payload.email,
            endDate: moment().add(365, 'days').toDate(),
            fullName: (payload.family_name||'') + (payload.given_name||'') + (payload.name || ''),
            organizationImage: `${payload.family_name} || S corp}`,
            size: 3,
            name: uuidv4(),
            type: 'free',
            password,
            phoneNumber: '00000000',
            phoneNumberPrefix: '+91',
            startDate: moment().subtract(5, 'minute').toDate()
          });
          return this.loginUtil(newUser, req);
        }
      }
    }
  }



  async getSuperiorRoleTypes(email: string) {
    const { roleType } = await this.userModel
      .findOne({ email }, { roleType: 1 })
      .lean()
      .exec();
    return this.getSuperiorRoles(roleType);
  }

  getSuperiorRoles(roleType: RoleType) {
    if (roleType === RoleType.admin) {
      return [];
    } else if (roleType === RoleType.seniorManager) {
      return [RoleType.admin];
    } else if (roleType === RoleType.manager) {
      return [RoleType.seniorManager, RoleType.admin];
    } else if (roleType === RoleType.frontline) {
      return [RoleType.seniorManager, RoleType.admin, RoleType.manager];
    }
  }

  async createReseller(createResellerDto: CreateResellerDto) {
    const user = new this.userModel({
      ...createResellerDto,
      verified: true,
      roles: ["reseller"],
      roleType: "reseller",
    });
    await this.sharedService.isEmailUnique(user.email);
    this.sharedService.setRegistrationInfo(user);
    await user.save();
    return this.sharedService.buildRegistrationInfo(user);
  }

  // ┬  ┬┌─┐┬─┐┬┌─┐┬ ┬  ┌─┐┌┬┐┌─┐┬┬
  // └┐┌┘├┤ ├┬┘│├┤ └┬┘  ├┤ │││├─┤││
  //  └┘ └─┘┴└─┴└   ┴   └─┘┴ ┴┴ ┴┴┴─┘
  async verifyEmail(req: Request, verifyUuidDto: VerifyUuidDto) {
    const user = await this.findByVerification(verifyUuidDto.verification);
    await this.setUserAsVerified(user);
    return this.loginUtil(user, req);
  }

  // ┬  ┌─┐┌─┐┬┌┐┌
  // │  │ ││ ┬││││
  // ┴─┘└─┘└─┘┴┘└┘
  async login(req: Request, loginUserDto: LoginUserDto) {
    const user = await this.findUserByEmail(loginUserDto.email);
    await this.isOrganizationActive(user.organization as any);
    this.isUserBlocked(user);
    await this.checkPassword(loginUserDto.password, user);
    return this.loginUtil(user, req);
  }

  async loginUtil(user, req) {
    const singleLoginKey = this.setSingleLoginKey(user);
    // save the user if passwords match
    await this.passwordsAreMatch(user);

    return this.getLoginDetails(req, user, singleLoginKey);
  }



  async getLoginDetails(req: Request, user: User, singleLoginKey: string) {
    const result =  {
      _id: user._id,
      fullName: user.fullName,
      organization: user.get("organization.name"),
      email: user.email,
      roleType: user.roleType,
      accessToken: await this.authService.createAccessToken(
        user._id,
        singleLoginKey
      ),
      refreshToken: await this.authService.createRefreshToken(req, user._id),
    }

    await user.save();
    return result;
  }

  // ┬─┐┌─┐┌─┐┬─┐┌─┐┌─┐┬ ┬  ┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐  ┌┬┐┌─┐┬┌─┌─┐┌┐┌
  // ├┬┘├┤ ├┤ ├┬┘├┤ └─┐├─┤  ├─┤│  │  ├┤ └─┐└─┐   │ │ │├┴┐├┤ │││
  // ┴└─└─┘└  ┴└─└─┘└─┘┴ ┴  ┴ ┴└─┘└─┘└─┘└─┘└─┘   ┴ └─┘┴ ┴└─┘┘└┘
  async refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto) {
    const userId = await this.authService.findRefreshToken(
      refreshAccessTokenDto.refreshToken
    );
    const user = await this.userModel.findById(userId);
    const singleLoginKey = this.setSingleLoginKey(user);
    if (!user) {
      throw new BadRequestException("Bad request");
    }
    return {
      accessToken: await this.authService.createAccessToken(
        user._id,
        singleLoginKey
      ),
    };
  }

  // ┌─┐┌─┐┬─┐┌─┐┌─┐┌┬┐  ┌─┐┌─┐┌─┐┌─┐┬ ┬┌─┐┬─┐┌┬┐
  // ├┤ │ │├┬┘│ ┬│ │ │   ├─┘├─┤└─┐└─┐││││ │├┬┘ ││
  // └  └─┘┴└─└─┘└─┘ ┴   ┴  ┴ ┴└─┘└─┘└┴┘└─┘┴└──┴┘
  async forgotPassword(
    req: Request,
    createForgotPasswordDto: CreateForgotPasswordDto
  ) {
    await this.findByEmail(createForgotPasswordDto.email);
    const verificationToken = await this.saveForgotPassword(
      req,
      createForgotPasswordDto
    );

    // can keep it async
    await this.sendEmailForgotPassword(
      createForgotPasswordDto.email,
      verificationToken
    );
    return {
      email: createForgotPasswordDto.email,
      message: "verification sent.",
    };
  }

  // ┌─┐┌─┐┬─┐┌─┐┌─┐┌┬┐  ┌─┐┌─┐┌─┐┌─┐┬ ┬┌─┐┬─┐┌┬┐  ┬  ┬┌─┐┬─┐┬┌─┐┬ ┬
  // ├┤ │ │├┬┘│ ┬│ │ │   ├─┘├─┤└─┐└─┐││││ │├┬┘ ││  └┐┌┘├┤ ├┬┘│├┤ └┬┘
  // └  └─┘┴└─└─┘└─┘ ┴   ┴  ┴ ┴└─┘└─┘└┴┘└─┘┴└──┴┘   └┘ └─┘┴└─┴└   ┴
  async forgotPasswordVerify(req: Request, verifyUuidDto: VerifyUuidDto) {
    const forgotPassword = await this.findForgotPasswordByUuid(verifyUuidDto);
    await this.setForgotPasswordFirstUsed(req, forgotPassword);
    new Date().toDateString();
    // now send the user to reset password page since it is already verified
    return {
      email: forgotPassword.email,
      forgotPassword,
      message: "now reset your password.",
    };
  }

  // ┬─┐┌─┐┌─┐┌─┐┌┬┐  ┌─┐┌─┐┌─┐┌─┐┬ ┬┌─┐┬─┐┌┬┐
  // ├┬┘├┤ └─┐├┤  │   ├─┘├─┤└─┐└─┐││││ │├┬┘ ││
  // ┴└─└─┘└─┘└─┘ ┴   ┴  ┴ ┴└─┘└─┘└┴┘└─┘┴└──┴┘
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const forgotPassword = await this.findForgotPasswordByEmail(
      resetPasswordDto
    );
    await this.setForgotPasswordFinalUsed(forgotPassword);
    await this.resetUserPassword(resetPasswordDto);
    return {
      email: resetPasswordDto.email,
      message: "password successfully changed.",
    };
  }
  // ┌─┐┬─┐┌┬┐┌─┐┌─┐┌┬┐┌─┐┌┬┐  ┌─┐┌─┐┬─┐┬  ┬┬┌─┐┌─┐
  // ├─┘├┬┘ │ ├┤ │   │ ├┤  ││  └─┐├┤ ├┬┘└┐┌┘││  ├┤
  // ┴  ┴└─ ┴ └─┘└─┘ ┴ └─┘─┴┘  └─┘└─┘┴└─ └┘ ┴└─┘└─┘
  async getAll(
    user: User,
    assigned: string,
    findAllDto: FindAllDto,
    organization
  ): Promise<any> {
    const { filters, page, perPage, searchTerm, showCols, sortBy } = findAllDto;
    const skip = page * perPage;

    const { email, roleType } = user;
    const subordinates = await this.getSubordinates(
      email,
      roleType,
      organization
    );

    const matchQuery = { email: { $in: subordinates } };

    // doing it in separate query instead of lookup because lookup will consume a lot of memory, it will fetch
    // all userTrack data and try to fix it in pipeline
    const users = await this.userModel
      .find(matchQuery, {
        email: 1,
        fullName: 1,
        manages: 1,
        roles: 1,
        roleType: 1,
        reportsTo: 1,
      })
      .skip(skip)
      .limit(perPage)
      .lean()
      .exec();

    const userCount = await this.userModel
      .countDocuments(matchQuery)
      .lean()
      .exec();

    return { users, total: userCount };
  }

  async getAllManagers(organization: string, userEmail?: string) {
    if (userEmail) {
      const superiorRoleTypes = await this.getSuperiorRoleTypes(userEmail);
      return this.userModel
        .find(
          { organization, roleType: { $in: superiorRoleTypes } },
          { email: 1, fullName: 1 }
        )
        .lean()
        .exec();
    } else {
      return this.userModel
        .find(
          { organization, roleType: { $ne: RoleType.frontline } },
          { email: 1, fullName: 1 }
        )
        .lean()
        .exec();
    }
  }

  /** @Todo replace getSubordinates in user.service with this one, checked: true is missing over there, and this should be
   * moved into a shared service
   */
  async getSubordinates(
    email: string,
    roleType: string,
    organization: string
  ): Promise<string[]> {
    if (roleType === "frontline") {
      return [email];
    }

    // admin should have access to all users regardless, there can be a frontline who reports to noone
    if (roleType === "admin") {
      const usrs = await this.userModel
        .find({ organization }, { email: 1 })
        .lean()
        .exec();
      const emails = usrs.map((u) => u.email);
      return emails;
    }

    const fq: any = [
      { $match: { organization, email, verified: true } },
      {
        $graphLookup: {
          from: "users",
          startWith: "$email", // starting value, this is an expression
          connectFromField: "email", // key name
          connectToField: "reportsTo", // key name
          as: "subordinates",
          maxDepth: 5,
        },
      },
      {
        $project: {
          subordinates: "$subordinates.email",
          roleType: "$subordinates.roleType",
          hierarchyWeight: 1,
        },
      },
    ];

    const result = await this.userModel.aggregate(fq);
    return [email, ...result[0].subordinates];
  }

  // ********************************************
  // ╔═╗╦═╗╦╦  ╦╔═╗╔╦╗╔═╗  ╔╦╗╔═╗╔╦╗╦ ╦╔═╗╔╦╗╔═╗
  // ╠═╝╠╦╝║╚╗╔╝╠═╣ ║ ║╣   ║║║║╣  ║ ╠═╣║ ║ ║║╚═╗
  // ╩  ╩╚═╩ ╚╝ ╩ ╩ ╩ ╚═╝  ╩ ╩╚═╝ ╩ ╩ ╩╚═╝═╩╝╚═╝
  // ********************************************

  private async findByVerification(verification: string): Promise<User> {
    const user = await this.userModel.findOne({
      verification,
      verified: false,
      verificationExpires: { $gt: new Date() },
    });
    if (!user) {
      throw new BadRequestException("Bad request.");
    }
    return user;
  }

  private async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email, verified: true });
    if (!user) {
      throw new UnauthorizedException("Email not found.");
    }
    return user;
  }

  private async setUserAsVerified(user) {
    user.verified = true;
    await user.save();
  }

  private async findUserByEmail(email: string): Promise<User> {
    const user = await this.userModel
      .findOne({ email, verified: true })
      .populate("organization");
    if (!user) {
      throw new UnauthorizedException("Wrong email or password.");
    }
    return user;
  }

  private async checkPassword(attemptPass: string, user) {
    const match = await bcrypt.compare(attemptPass, user.password);
    if (!match) {
      await this.passwordsDoNotMatch(user);
      throw new UnauthorizedException("Wrong email or password.");
    }
    return match;
  }

  private isUserBlocked(user) {
    if (user.blockExpires > Date.now()) {
      throw new ConflictException("User has been blocked try later.");
    }
  }

  private async isOrganizationActive(org: Organization) {
    const today = moment().toDate();
    const organization = await this.organizationModel
      .findOne({
        _id: org._id,
        startDate: { $lte: today },
        endDate: { $gte: today },
      })
      .lean()
      .exec();

    if (!organization) {
      throw new NotAcceptableException(
        "Validity expired, please contact admin"
      );
    }
  }

  private async passwordsDoNotMatch(user) {
    user.loginAttempts += 1;
    await user.save();
    if (user.loginAttempts >= this.LOGIN_ATTEMPTS_TO_BLOCK) {
      await this.blockUser(user);
      throw new ConflictException("User blocked.");
    }
  }

  private async blockUser(user) {
    user.blockExpires = addHours(new Date(), this.HOURS_TO_BLOCK);
    await user.save();
  }

  private async passwordsAreMatch(user) {
    // set login attempt to zero for next login
    user.loginAttempts = 0;
    await user.save();
  }

  private setSingleLoginKey(user: User) {
    // setting the single signin key
    const singleLoginKey = uuidv4();
    user.singleLoginKey = singleLoginKey;

    return singleLoginKey;
  }
  private async saveForgotPassword(
    req: Request,
    createForgotPasswordDto: CreateForgotPasswordDto
  ) {
    const verificationToken = v4();
    const forgotPassword = await new this.forgotPasswordModel({
      country: this.authService.getCountry(req),
      email: createForgotPasswordDto.email,
      verification: verificationToken,
      ip: this.authService.getIp(req),
      browser: this.authService.getBrowserInfo(req),
      expires: addHours(new Date(), this.HOURS_TO_VERIFY),
    });
    await forgotPassword.save();
    return verificationToken;
  }

  private async findForgotPasswordByUuid(
    verifyUuidDto: VerifyUuidDto
  ): Promise<ForgotPassword> {
    const forgotPassword = await this.forgotPasswordModel.findOne({
      verification: verifyUuidDto.verification,
      firstUsed: false,
      finalUsed: false,
      expires: { $gt: new Date() },
    });
    if (!forgotPassword) {
      throw new BadRequestException("Bad request.");
    }
    return forgotPassword;
  }

  private async setForgotPasswordFirstUsed(
    req: Request,
    forgotPassword: ForgotPassword
  ) {
    forgotPassword.firstUsed = true;
    forgotPassword.ipChanged = this.authService.getIp(req);
    forgotPassword.browserChanged = this.authService.getBrowserInfo(req);
    forgotPassword.countryChanged = this.authService.getCountry(req);
    await forgotPassword.save();
  }

  private async findForgotPasswordByEmail(
    resetPasswordDto: ResetPasswordDto
  ): Promise<ForgotPassword> {
    const forgotPassword = await this.forgotPasswordModel.findOne({
      email: resetPasswordDto.email,
      firstUsed: true,
      finalUsed: false,
      expires: { $gt: new Date() },
    });
    if (!forgotPassword) {
      throw new BadRequestException("Bad request.");
    }
    return forgotPassword;
  }

  private async setForgotPasswordFinalUsed(forgotPassword: ForgotPassword) {
    forgotPassword.finalUsed = true;
    await forgotPassword.save();
  }

  private async resetUserPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userModel.findOne({
      email: resetPasswordDto.email,
      verified: true,
    });
    user.password = resetPasswordDto.password;
    await user.save();
  }

  async insertMany(activeUserId: string, filePath: string) {
    const jsonRes = await parseExcel(filePath);

    const userid = Types.ObjectId(activeUserId);
    // this path comes from multer and is where the original file is stored
    let adminActions = new this.adminActionModel({
      userid,
      actionType: "upload",
      filePath,
      savedOn: "disk",
      fileType: "usersBulk",
    });

    await adminActions.save();
    // this will contain the file with errors
    filePath = await this.addNewUsers(jsonRes); //this will send uploaded path to the worker, or aws s3 location
    adminActions = new this.adminActionModel({
      userid,
      actionType: "error",
      filePath,
      savedOn: "disk",
      fileType: "usersBulk",
    });

    return adminActions.save();
  }

  /**
   * this function first splits up users so that they can be stored in the users collection and then transforms them back
   * to their original value so that they can be written in json
   */
  async addNewUsers(users: User[]): Promise<string> {
    const erroredUsers: any = [];
    for (const u of users) {
      /** check all users in the manages section exist, even if they dont it won't cause any trouble though */
      u.hierarchyWeight = this.assignHierarchyWeight(u);
      u.email = u.email.toLocaleLowerCase();

      let user = await this.userModel.findOne({ email: u.email });
      let errorMessage = "";
      if (user) {
        errorMessage = "Account with that email address already exists.";
        erroredUsers.push({ ...this.withManages(u), errorMessage });
        continue;
      }

      try {
        user = new this.userModel(u);
        await user.save();
      } catch (e) {
        erroredUsers.push({ ...this.withManages(u), errorMessage });
      }
    }

    return this.saveToExcel(erroredUsers);
  }

  private withManages(u) {
    u.manages = u.manages.join(",");
    return u;
  }

  private parseManages(user: any) {
    if (!user.manages) return [];
    const manages = user.manages.replace(/\s/g, "").split(",");
    return manages;
  }

  private assignHierarchyWeight(u: User) {
    switch (u.roleType.trim().toLocaleLowerCase()) {
      case "seniorManager":
        return 60;
      case "manager":
        return 40;
      case "frontline":
        return 20;
      default:
        return 0;
    }
  }

  async managersForReassignment(
    email: string,
    roleType: string,
    organization: string
  ) {
    const emails = await this.getSubordinates(email, roleType, organization);

    return emails;
  }

  saveToExcel(json) {
    const filename = `users.xlsx`;
    const filePath = join(__dirname, "..", "..", "crm_response", filename);
    const created_ws = utils.json_to_sheet(json);

    const wb = utils.book_new();
    utils.book_append_sheet(wb, created_ws, filename);

    writeFile(wb, filePath);

    return filePath;
  }

  async sendEmailForgotPassword(
    email: string,
    token: string
  ): Promise<boolean> {
    var userFromDb = await this.userModel.findOne({ email: email });
    if (!userFromDb)
      throw new HttpException("LOGIN.USER_NOT_FOUND", HttpStatus.NOT_FOUND);

    if (token) {
      let transporter = createTransport({
        service: "Mailgun",
        auth: {
          user: config.mail.user,
          pass: config.mail.pass,
        },
      });

      let mailOptions = {
        from: '"Company" <' + config.mail.user + ">",
        to: [email],
        subject: "Frogotten Password",
        text: "Forgot Password",
        html: getForgotPasswordTemplate({
          hostUrl: config.host.url,
          hostPort: config.host.port,
          resetToken: token,
        }),
      };

      var sended = await new Promise<boolean>(async function (resolve, reject) {
        return await transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
            console.log("Message sent: %s", error);
            return reject(false);
          }
          console.log("Message sent: %s", info.messageId);
          resolve(true);
        });
      });

      return sended;
    } else {
      throw new HttpException(
        "REGISTER.USER_NOT_REGISTERED",
        HttpStatus.FORBIDDEN
      );
    }
  }

  async updateProfile(user: User, updateProfileDto: UpdateProfileDto) {
    const {
      fullName,
      password,
      confirmNewPassword,
      newPassword,
      phoneNumber,
    } = updateProfileDto;
    await this.checkPassword(password, user);

    user.fullName = fullName;
    user.password = newPassword;
    user.phoneNumber = phoneNumber;

    await user.save();

    return { status: "success" };
  }

  async getUserProfile(email) {
    return this.userModel
      .findOne({ email }, { email: 1, fullName: 1, phoneNumber: 1 })
      .lean()
      .exec();
  }

  async getAllUsersHack(organization: string) {
    const page = 1,
      perPage = 25,
      skip = 0;
    return this.userModel
      .aggregate([
        {
          $match: { verified: true, organization },
        },
        {
          $project: { email: 1, fullName: 1 },
        },
        {
          $facet: {
            metadata: [
              { $count: "total" },
              { $addFields: { page: Number(page) } },
            ],
            users: [{ $skip: skip }, { $limit: perPage }], // add projection here wish you re-shape the docs
          },
        },
      ])
      .exec();
  }

  async getUserById(userId: string, organization) {
    const user = await this.userModel
      .findOne({ _id: userId }, { password: 0 })
      .lean()
      .exec();

    return user;
  }

  async updateUser(userid: string, user: CreateUserDto) {
    user.password = await hashPassword(user.password);
    return this.userModel.updateOne(
      { _id: userid },
      { ...user, roles: [user.roleType] }
    );
  }

  async subscribeToPushNotification(
    userId: string,
    pushtoken: PushNotificationDto
  ) {
    await this.userModel.findOneAndUpdate({ _id: userId }, { pushtoken });
    return { message: "Successfully registered to push notification" };
  }

  async sendPushNotification() {
    throw new MethodNotAllowedException();
  }

  async getAllUsersForOrganization(organization: string) {
    return this.userModel
      .find(
        { organization },
        { phoneNumber: 1, blockExpires: 1, email: 1, verified: 1, fullName: 1 }
      )
      .lean()
      .exec();
  }



  async getUsersForRoles(organization: string, roles: RoleType[])  {
    const users = await this.userModel.find({organization, roleType: {$in: roles}}).lean().exec();
    return users;
  } 



  async verifyGoogleOauth(token: string) {
    const ticket = await oauth2Client.verifyIdToken({
        idToken: token,
        audience: [config.oauth.google.clientId],  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];

    return payload;
  }
}
