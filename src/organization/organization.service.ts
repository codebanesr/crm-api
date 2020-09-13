import { TwilioService } from "@lkaric/twilio-nestjs";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SharedService } from "src/shared/shared.service";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { GenerateTokenDto } from "./dto/generate-token.dto";
import { Organization } from "./interface/organization.interface";
import { RedisService } from "nestjs-redis";

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel("Organization")
    private readonly organizationalModel: Model<Organization>,
    private readonly twilioService: TwilioService,
    private readonly sharedService: SharedService,
    private readonly redisService: RedisService
  ) {}

  async createOrganization(createOrganizationDto: CreateOrganizationDto) {
    const organization = new this.organizationalModel(createOrganizationDto);
    return organization.save();
  }

  async generateToken(generateTokenDto: GenerateTokenDto) {
    const { mobileNumber } = generateTokenDto;

    const client = await this.redisService.getClient();
    let otp = await client.get(mobileNumber)
    if(!otp) {
      otp = this.sharedService.generateOtp();
      await client.set(mobileNumber, otp, 'EX', 300)
    }

    return this.sendOtp(otp, mobileNumber);
  }

  sendOtp(otp, mobileNumber) {
    Logger.debug({otp, mobileNumber})
    return this.twilioService.client.messages.create({
      body: `Please use this to confirm your account ${otp}`,
      from: "+19402203638",
      to: mobileNumber,
    });
  }
}
