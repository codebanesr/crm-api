import { TwilioService } from "@lkaric/twilio-nestjs";
import {
  ConflictException,
  Injectable,
  Logger,
  PreconditionFailedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SharedService } from "../shared/shared.service";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { GenerateTokenDto } from "./dto/generate-token.dto";
import { Organization } from "./interface/organization.interface";
import { RedisService } from "nestjs-redis";
import config from "../config/config";
import { ValidateNewOrganizationDto } from "./dto/validation.dto";
import { UserService } from "../user/user.service";
import { ResellerOrganization } from "../organization/interface/reseller-organization.interface";
import { UpdateQuotaDto } from "./dto/update-quota.dto";
import * as moment from "moment";
import { Transaction } from "./interface/transaction.interface";
import { RoleType } from "../shared/role-type.enum";
import { AdminAction } from "../agent/interface/admin-actions.interface";
import { CampaignForm } from "../campaign/interfaces/campaign-form.interface";
import { Campaign } from "../campaign/interfaces/campaign.interface";
import { Disposition } from "../campaign/interfaces/disposition.interface";
import { CampaignConfig } from "../lead/interfaces/campaign-config.interface";
import { Lead } from "../lead/interfaces/lead.interface";

@Injectable()
export class OrganizationService {
  async getCurrentOrganization(organization: string) {
    return this.organizationalModel.findById(organization).lean().exec();
  }
  constructor(
    @InjectModel("Organization")
    private readonly organizationalModel: Model<Organization>,

    @InjectModel("ResellerOrganization")
    private readonly resellerOrganizationModel: Model<ResellerOrganization>,

    @InjectModel("Transaction")
    private readonly transactionModel: Model<Transaction>,

    @InjectModel("Campaign")
    private readonly campaignModel: Model<Campaign>,

    @InjectModel("CampaignConfig")
    private readonly campaignConfigModel: Model<CampaignConfig>,

    @InjectModel("Disposition")
    private readonly dispositionModel: Model<Disposition>,

    @InjectModel("AdminAction")
    private readonly adminActionModel: Model<AdminAction>,

    @InjectModel("CampaignForm")
    private readonly campaignFormModel: Model<CampaignForm>,

    @InjectModel("Lead")
    private readonly leadModel: Model<Lead>,

    private readonly twilioService: TwilioService,
    private readonly sharedService: SharedService,
    private readonly redisService: RedisService,
    private userService: UserService
  ) {}

  /** @Todo dump all information to s3 before deleting and this should be done in
   * worker code
   */
  async deleteOrganization(organization: string) {
    const session = await this.organizationalModel.db.startSession();
    session.startTransaction();
    try {
      await this.campaignConfigModel.deleteMany({ organization });
      await this.campaignModel.deleteMany({ organization });
      await this.leadModel.deleteMany({ organization });
      await this.transactionModel.deleteMany({ organization });
      await this.organizationalModel.deleteOne({ _id: organization });
      await this.resellerOrganizationModel.deleteOne({ orgId: organization });
      await this.dispositionModel.deleteMany({ organization });
      await this.adminActionModel.deleteMany({ organization });
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      Logger.error(
        "An error occured while in delete organization transaction",
        e
      );

      session.endSession();
      throw new PreconditionFailedException(
        "An error occured while in delete organization transaction"
      );
    } finally {
      session.endSession();
    }
  }

  /** @Todo everything should happen in a transaction */
  async createOrganization(
    createOrganizationDto: CreateOrganizationDto,
    resellerId: string,
    resellerName: string
  ) {
    const { email, fullName, password, phoneNumber } = createOrganizationDto;
    await this.isOrganizationalPayloadValid(createOrganizationDto);
    // now save organization information in the user schema...

    const session = await this.organizationalModel.db.startSession();

    session.startTransaction();
    try {
      const organization = new this.organizationalModel(createOrganizationDto);
      const result = await organization.save();

      await this.resellerOrganizationModel.create({
        credit: 300,
        orgId: result._id,
        orgName: result.name,
        resellerId,
        resellerName,
      });

      await this.userService.create(
        {
          email,
          fullName,
          password,
          roleType: RoleType.admin,
          phoneNumber,
        },
        result._id,
        true
      );

      await session.commitTransaction();
    } catch (e) {
      Logger.error("Transaction aborted", e);
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }

  async getAllResellerOrganization(id: string) {
    return this.resellerOrganizationModel.find({ resellerId: id });
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
    // const correctOTP = await this.getOTPForNumber(
    //     createOrganizationDto.phoneNumber
    // );
    // const { email, phoneNumber, name } = createOrganizationDto;
    // const count = await this.organizationalModel.count({
    //   $or: [{ name }, { email }, { phoneNumber }],
    // });
    // Logger.debug({ count });
    // if (createOrganizationDto.otp !== correctOTP) {
    //   throw new HttpException("Incorrect otp", 421);
    // }
    // if (count !== 0) {
    //   throw new ConflictException();
    // }

    return true;
  }

  async createOrUpdateUserQuota(obj: UpdateQuotaDto) {
    const {
      discount,
      months,
      perUserRate,
      seats,
      total: UITotal,
      organization,
    } = obj;
    const total = perUserRate * (1 - 0.01 * discount) * seats * months;

    if (total !== UITotal) {
      throw new PreconditionFailedException();
    }

    const expiresOn = moment().add(months, "M");
    return this.transactionModel.create({
      discount,
      perUserRate,
      seats,
      total,
      expiresOn: expiresOn.toDate(),
      organization,
    });
  }

  async getAllPayments(organization) {
    return this.transactionModel
      .find({ organization })
      .sort({ _id: 1 })
      .limit(15);
  }

  async getAllOrganizations() {
    return this.organizationalModel.find().lean().exec();
  }
}
