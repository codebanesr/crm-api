import { TwilioService } from "@lkaric/twilio-nestjs";
import {
  ConflictException,
  HttpException,
  HttpStatus,
  ImATeapotException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SharedService } from "../shared/shared.service";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { GenerateTokenDto } from "./dto/generate-token.dto";
import { Organization } from "./interface/organization.interface";
import { RedisService } from "nestjs-redis";
import config from "../config";
import { ValidateNewOrganizationDto } from "./dto/validation.dto";
import { UserService } from "../user/user.service";

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel("Organization")
    private readonly organizationalModel: Model<Organization>,
    private readonly twilioService: TwilioService,
    private readonly sharedService: SharedService,
    private readonly redisService: RedisService,
    private userService: UserService
  ) {}

  async createOrganization(createOrganizationDto: CreateOrganizationDto) {
    const { email, fullName, password, phoneNumber } = createOrganizationDto;
    await this.isOrganizationalPayloadValid(createOrganizationDto);
    // now save organization information in the user schema...
    try {
      const organization = new this.organizationalModel(createOrganizationDto);
      const result = await organization.save();
      await this.userService.create({
        email,
        fullName,
        password,
        roleType: "admin",
        roles: ["admin", "user"],
        manages: [],
        reportsTo: "",
        phoneNumber
      }, result._id);
    }catch(e) {
      return new ImATeapotException(e.message);
    }
    return 
  }

  async generateToken(generateTokenDto: GenerateTokenDto) {
    const { mobileNumber } = generateTokenDto;

    const client = await this.redisService.getClient();
    let otp = await client.get(mobileNumber);
    if (!otp) {
      otp = this.sharedService.generateOtp();
      await client.set(mobileNumber, otp, "EX", 300);
    }

    return this.sendOtp(otp, mobileNumber);
  }

  async getOTPForNumber(mobileNumber: string) {
    const client = this.redisService.getClient();
    return client.get(mobileNumber);
  }

  sendOtp(otp, mobileNumber) {
    Logger.debug({ otp, mobileNumber });
    return this.twilioService.client.messages.create({
      body: `Please use this to confirm your account ${otp}`,
      from: config.twilio.mobileNumber,
      to: mobileNumber,
    });
  }

  async isAttributeValid(validationDto: ValidateNewOrganizationDto) {
    const { label, value } = validationDto;

    const count = await this.organizationalModel.count({ [label]: value });
    if (count != 0) {
      throw new ConflictException(
        `An organization with this ${label} ${value} already exists`
      );
    }
  }

  async isOrganizationalPayloadValid(
    createOrganizationDto: CreateOrganizationDto
  ) {
    const correctOTP = await this.getOTPForNumber(
        createOrganizationDto.phoneNumber
    );
    const { email, phoneNumber, organizationName } = createOrganizationDto;
    const count = await this.organizationalModel.count({
      $or: [{ name: organizationName }, { email }, { phoneNumber }],
    });
    Logger.debug({ count });
    if (createOrganizationDto.otp !== correctOTP) {
      throw new HttpException("Incorrect otp", 421);
    }
    if (count !== 0) {
      throw new ConflictException();
    }
  }
}
