import { ResetPasswordDto } from "./dto/reset-password.dto";
import { AuthService } from "./../auth/auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  Logger,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
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
import { AdminAction } from "./interfaces/admin-actions.interface";
import { FindAllDto } from "../lead/dto/find-all.dto";
import { writeFile, utils } from "xlsx";
import { join } from "path";
import { default as config } from "../config";
import { createTransport } from "nodemailer";
import { getForgotPasswordTemplate } from "../utils/forgot-password-template";

@Injectable()
export class UserService {
  HOURS_TO_VERIFY = 4;
  HOURS_TO_BLOCK = 6;
  LOGIN_ATTEMPTS_TO_BLOCK = 5;

  constructor(
    @InjectModel("User") private readonly userModel: Model<User>,
    @InjectModel("ForgotPassword")
    private readonly forgotPasswordModel: Model<ForgotPassword>,
    @InjectModel("AdminAction")
    private readonly adminActionModel: Model<AdminAction>,
    private readonly authService: AuthService
  ) {}

  // ┌─┐┬─┐┌─┐┌─┐┌┬┐┌─┐  ┬ ┬┌─┐┌─┐┬─┐
  // │  ├┬┘├┤ ├─┤ │ ├┤   │ │└─┐├┤ ├┬┘
  // └─┘┴└─└─┘┴ ┴ ┴ └─┘  └─┘└─┘└─┘┴└─
  // to call from api use this
  // if we have the organiztion then we call this function directly, to call from some other service
  async create(createUserDto: CreateUserDto, organization: string) {
    const user = new this.userModel({
      ...createUserDto,
      organization,
      verified: true,
    });
    await this.isEmailUnique(user.email);
    this.setRegistrationInfo(user);
    await user.save();
    return this.buildRegistrationInfo(user);
  }

  // ┬  ┬┌─┐┬─┐┬┌─┐┬ ┬  ┌─┐┌┬┐┌─┐┬┬
  // └┐┌┘├┤ ├┬┘│├┤ └┬┘  ├┤ │││├─┤││
  //  └┘ └─┘┴└─┴└   ┴   └─┘┴ ┴┴ ┴┴┴─┘
  async verifyEmail(req: Request, verifyUuidDto: VerifyUuidDto) {
    const user = await this.findByVerification(verifyUuidDto.verification);
    await this.setUserAsVerified(user);
    return {
      fullName: user.fullName,
      email: user.email,
      accessToken: await this.authService.createAccessToken(user._id),
      refreshToken: await this.authService.createRefreshToken(req, user._id),
    };
  }

  // ┬  ┌─┐┌─┐┬┌┐┌
  // │  │ ││ ┬││││
  // ┴─┘└─┘└─┘┴┘└┘
  async login(req: Request, loginUserDto: LoginUserDto) {
    const user = await this.findUserByEmail(loginUserDto.email);
    this.isUserBlocked(user);
    await this.checkPassword(loginUserDto.password, user);
    await this.passwordsAreMatch(user);

    return {
      fullName: user.fullName,
      email: user.email,
      accessToken: await this.authService.createAccessToken(user._id),
      refreshToken: await this.authService.createRefreshToken(req, user._id),
    };
  }

  // ┬─┐┌─┐┌─┐┬─┐┌─┐┌─┐┬ ┬  ┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐  ┌┬┐┌─┐┬┌─┌─┐┌┐┌
  // ├┬┘├┤ ├┤ ├┬┘├┤ └─┐├─┤  ├─┤│  │  ├┤ └─┐└─┐   │ │ │├┴┐├┤ │││
  // ┴└─└─┘└  ┴└─└─┘└─┘┴ ┴  ┴ ┴└─┘└─┘└─┘└─┘└─┘   ┴ └─┘┴ ┴└─┘┘└┘
  async refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto) {
    const userId = await this.authService.findRefreshToken(
      refreshAccessTokenDto.refreshToken
    );
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException("Bad request");
    }
    return {
      accessToken: await this.authService.createAccessToken(user._id),
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
    // if(!assigned) {
    //     const users = await User.aggregate([
    //         { $match: { email: { $exists: false } } }
    //     ]);
    //     return res.status(200).send(users);
    // }
    const { filters, page, perPage, searchTerm, showCols, sortBy } = findAllDto;
    const skip = (page - 1) * perPage;

    const subordinates = await this.getSubordinates(user, organization);
    const result = await this.userModel.aggregate([
      // removing subordinates because even telecaller can assign leads to managers
      { $match: { email: { $in: subordinates }, organization } },
      {
        $lookup: {
          from: "users",
          localField: "email",
          foreignField: "manages",
          as: "managedBy",
        },
      },
      { $unwind: "$managedBy" },
      {
        $facet: {
          metadata: [
            { $count: "total" },
            { $addFields: { page: Number(page) } },
          ],
          users: [{ $skip: skip }, { $limit: perPage }], // add projection here wish you re-shape the docs
        },
      },
    ]);

    return { users: result[0].users, metadata: result[0].metadata[0] };
  }

  async getSubordinates(user: User, organization: string): Promise<any> {
    if (user.roleType === "admin") {
      const users = await this.userModel.find(
        { organization },
        { email: 1, _id: 0 }
      );
      return users.map((u) => u.email);
    }

    if (user.roleType !== "manager" && user.roleType !== "seniorManager") {
      return [user.email];
    }
    const fq: any = [
      { $match: { email: user.email } },
      {
        $graphLookup: {
          from: "users",
          startWith: "$manages",
          connectFromField: "manages",
          connectToField: "email",
          as: "subordinates",
        },
      },
      {
        $project: {
          subordinates: "$subordinates.email",
          roleType: "$roleType",
          hierarchyWeight: 1,
        },
      },
    ];

    const result = await this.userModel.aggregate(fq);
    return result[0].subordinates;
  }

  // ********************************************
  // ╔═╗╦═╗╦╦  ╦╔═╗╔╦╗╔═╗  ╔╦╗╔═╗╔╦╗╦ ╦╔═╗╔╦╗╔═╗
  // ╠═╝╠╦╝║╚╗╔╝╠═╣ ║ ║╣   ║║║║╣  ║ ╠═╣║ ║ ║║╚═╗
  // ╩  ╩╚═╩ ╚╝ ╩ ╩ ╩ ╚═╝  ╩ ╩╚═╝ ╩ ╩ ╩╚═╝═╩╝╚═╝
  // ********************************************

  private async isEmailUnique(email: string) {
    const user = await this.userModel.findOne({ email, verified: true });
    if (user) {
      throw new BadRequestException("Email most be unique.");
    }
  }

  private setRegistrationInfo(user): any {
    user.verification = v4();
    user.verificationExpires = addHours(new Date(), this.HOURS_TO_VERIFY);
  }

  private buildRegistrationInfo(user): any {
    const userRegistrationInfo = {
      fullName: user.fullName,
      email: user.email,
      verified: user.verified,
    };
    return userRegistrationInfo;
  }

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
      throw new NotFoundException("Email not found.");
    }
    return user;
  }

  private async setUserAsVerified(user) {
    user.verified = true;
    await user.save();
  }

  private async findUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email, verified: true });
    if (!user) {
      throw new NotFoundException("Wrong email or password.");
    }
    return user;
  }

  private async checkPassword(attemptPass: string, user) {
    const match = await bcrypt.compare(attemptPass, user.password);
    if (!match) {
      await this.passwordsDoNotMatch(user);
      throw new NotFoundException("Wrong email or password.");
    }
    return match;
  }

  private isUserBlocked(user) {
    if (user.blockExpires > Date.now()) {
      throw new ConflictException("User has been blocked try later.");
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
    user.loginAttempts = 0;
    await user.save();
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
    const jsonRes = parseExcel(filePath);

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
      u.manages = this.parseManages(u);
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

  async managersForReassignment(manages: string[], organization: string) {
    return this.userModel
      .find(
        {
          $and: [
            { organization },
            { email: { $in: manages } },
            { roleType: { $ne: "frontline" } },
          ],
        },
        { email: 1 }
      )
      .lean()
      .exec();
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

  async sendEmailForgotPassword(email: string, token): Promise<boolean> {
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
        html: getForgotPasswordTemplate(
          config.host.url,
          config.host.port,
          token
        ),
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

  async getAllUsersHack(organization: string) {
    const page = 1,
      perPage = 20,
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

  async getUserById(userid: string, organization) {
    return this.userModel.findOne(
      { _id: userid },
      { password: 0 }
    );
  }

  async updateUser(userid: string, user: CreateUserDto) {
    return this.userModel.updateOne({_id: userid }, user);
  }
}
