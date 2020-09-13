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
    const otp = this.sharedService.generateOtp();

    Logger.debug({otp})
    const client = await this.redisService.getClient();
    return client.set(mobileNumber, otp, (err, reply) => {
      this.twilioService.client.messages.create({
        body: `Please use this to confirm your account ${otp}`,
        from: "+19402203638",
        to: "+919199946568",
      });
    })
  }
}
