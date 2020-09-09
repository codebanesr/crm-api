import { ResetPasswordDto } from "./dto/reset-password.dto";
import { AuthService } from "./../auth/auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  Logger,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { v4 } from "uuid";
import { addHours } from "date-fns";
import * as bcrypt from "bcrypt";
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
    private readonly adminAction: Model<AdminAction>,
    private readonly authService: AuthService
  ) {}

  // ┌─┐┬─┐┌─┐┌─┐┌┬┐┌─┐  ┬ ┬┌─┐┌─┐┬─┐
  // │  ├┬┘├┤ ├─┤ │ ├┤   │ │└─┐├┤ ├┬┘
  // └─┘┴└─└─┘┴ ┴ ┴ └─┘  └─┘└─┘└─┘┴└─
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
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
    await this.saveForgotPassword(req, createForgotPasswordDto);
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
    findAllDto: FindAllDto
  ): Promise<any> {
    // if(!assigned) {
    //     const users = await User.aggregate([
    //         { $match: { email: { $exists: false } } }
    //     ]);
    //     return res.status(200).send(users);
    // }
    const { filters, page, perPage, searchTerm, showCols, sortBy } = findAllDto;
    const skip = (page - 1) * perPage;

    const subordinates = await this.getSubordinates(user);
    const result = await this.userModel.aggregate([
      // removing subordinates because even telecaller can assign leads to managers
      { $match: { email: { $in: subordinates } } },
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

  async getSubordinates(user: User): Promise<any> {
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
    const forgotPassword = await new this.forgotPasswordModel({
      country: this.authService.getCountry(req),
      email: createForgotPasswordDto.email,
      verification: v4(),
      ip: this.authService.getIp(req),
      browser: this.authService.getBrowserInfo(req),
      expires: addHours(new Date(), this.HOURS_TO_VERIFY),
    });
    await forgotPassword.save();
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
    let adminActions = new this.adminAction({
      userid,
      actionType: "upload",
      filePath,
      savedOn: "disk",
      fileType: "agentBulk",
    });

    await adminActions.save();
    // this will contain the file with errors 
    filePath = await this.addNewUsers(jsonRes); //this will send uploaded path to the worker, or aws s3 location
    adminActions = new this.adminAction({
      userid,
      actionType: "error",
      filePath,
      savedOn: "disk",
      fileType: "agentBulk"
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
    u.manages = u.manages.join(",")
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

  async managersForReassignment(manages: string[]) {
    return this.userModel
      .find(
        {
          $and: [
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
    const filePath = join(__dirname, '..', '..', "crm_response", filename);
    const created_ws = utils.json_to_sheet(json);

    const wb = utils.book_new();
    utils.book_append_sheet(wb, created_ws, filename);

    writeFile(wb, filePath);

    return filePath;
  }
}
