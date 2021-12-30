import {
  BadRequestException,
  Injectable,
  Logger,
  PreconditionFailedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Campaign } from "./interfaces/campaign.interface";
import { CampaignConfig } from "../lead/interfaces/campaign-config.interface";
import parseExcel from "../utils/parseExcel";
import { writeFile, utils } from "xlsx";
import { Disposition } from "./interfaces/disposition.interface";
import { join } from "path";
import { AdminAction } from "../agent/interface/admin-actions.interface";
import { CampaignForm } from "./interfaces/campaign-form.interface";
import { Lead } from "../lead/interfaces/lead.interface";
import { keyBy } from "lodash";
import { UpdateConfigsDto } from "./dto/update-configs.dto";
import { CreateCampaignAndDispositionDto } from "./dto/create-campaign-disposition.dto";
import { coreConfig } from "./core-config";
import * as moment from "moment";
import { RoleType } from "../shared/role-type.enum";
import { DeleteCampaignConfigDto } from "./dto/delete-campaignConfig.dto";
import { DcaeDto } from "./dto/dcae.dto";

@Injectable()
export class CampaignService {
  constructor(
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
    private readonly leadModel: Model<Lead>
  ) {}

  // sort by default handler
  async findAll({
    page,
    perPage,
    filters,
    sortBy,
    loggedInUserId,
    organization,
    roles,
  }) {
    const limit = Number(perPage);
    const skip = Number((page - 1) * limit);

    const campaignAgg = this.campaignModel.aggregate();

    // dont fetch any archived campaign, make sure archived is not a string
    campaignAgg.match({ organization, archived: { $ne: filters.archived ? false: true } });
    const { campaigns = [], select = [] } = filters;

    // if the admin wants to see the campaign list we dont
    if (!roles.includes(RoleType.admin)) {
      // mongodb understands that assigness is an array so it will go and check every single value
      // in the array and if any one of that is a match, it will keep that record
      campaignAgg.match({
        $or: [{ createdBy: loggedInUserId }, { assignees: loggedInUserId }],
      });
    } else {
      // if he is an admin just check if he belongs to this organization
      campaignAgg.match({
        organization,
      });
    }

    // if campaign filter is applied, @Todo verify if this is still required, i believe that this schema was changed
    if (campaigns && campaigns.length > 0) {
      campaignAgg.match({ type: { $in: campaigns } });
    }

    if (select.length > 0) {
      const project = {};
      select.forEach((s) => {
        project[s] = 1;
      });

      campaignAgg.project(project);
    }

    campaignAgg.facet({
      metadata: [{ $count: "total" }, { $addFields: { page: Number(page) } }],
      data: [{ $skip: skip }, { $limit: limit }], // add projection here wish you re-shape the docs
    });

    // lists all campaigns with created at, name of campaign etc
    const result = await campaignAgg.exec();

    // finding quick stats
    const campaignIds = result[0].data.map((d) => d._id);
    const quickStatsAgg = await this.getQuickStatsForCampaigns(
      campaignIds,
      organization
    );

    return {
      data: result[0].data,
      metadata: result[0].metadata[0],
      quickStatsAgg,
    };
  }

  //   campaign id from params.campaignId

  async findOneByIdOrName(campaignId) {
    return this.campaignModel.findById(campaignId).lean().exec();
  }

  async patch(campaignId, requestBody) {
    const updateOps: { [index: string]: any } = {};
    for (const ops of requestBody) {
      const propName = ops.propName;
      updateOps[propName] = ops.value;
    }
    return this.campaignModel.update({ _id: campaignId }, { $set: updateOps });
  }

  async deleteOne(campaignId) {
    const id = campaignId;
    return this.campaignModel.remove({ _id: id });
  }

  //   @Query partialEmail
  async getHandlerEmailHints(partialEmail: string) {
    const limit = 15;
    const result = await this.campaignModel.aggregate([
      {
        $match: {
          handler: { $regex: `^${partialEmail}` },
        },
      },
      {
        $project: { handler: 1, _id: 0 },
      },
      { $limit: limit },
    ]);

    return result.map((r) => r.handler);
  }

  //   @Query
  async getCampaignTypes(hint, organization) {
    return this.campaignModel
      .find({
        campaignName: { $regex: "^" + hint, $options: "I" },
        organization,
      })
      .limit(20);
  }

  /** @Todo this has to be thought better */
  async defaultDisposition() {
    try {
      let disposition = await this.dispositionModel.findOne({
        campaign: "5ee225b99580594afd8561dd",
      });
      if (!disposition) {
        return {
          error:
            "Core campaign schema not found, verify that creator id exists in user schema and campaignId in campaign schema... This is for core config. Also remember that during populate mongoose will look for these ids",
        };
      }

      return disposition;
    } catch (e) {
      return { e: e.message };
    }
  }

  async getDispositionForCampaign(campaignId: string) {
    if (!campaignId || campaignId == "core") {
      return this.defaultDisposition();
    } else {
      return this.dispositionModel
        .findOne({ campaign: campaignId })
        .sort({ _id: -1 })
        .lean()
        .exec();
    }
  }

  async uploadConfig(file) {
    const path = file.path;
    const excelObject = parseExcel(path);
  }

  /** */
  async createCampaignAndDisposition({
    activeUserId,
    dispositionData,
    campaignInfo,
    organization,
    editableCols,
    browsableCols,
    formModel,
    uniqueCols,
    assignTo,
    advancedSettings,
    groups,
    isNew,
    autodialSettings,
  }: CreateCampaignAndDispositionDto & {
    activeUserId: string;
    organization: string;
  }) {
    if (isNew) {
      browsableCols = coreConfig.map((c) => c.internalField);
      editableCols = browsableCols;
      uniqueCols = ["mobilePhone"];
    }

    let campaign;
    if (!isNew) {
      campaign = await this.campaignModel
        .findOneAndUpdate(
          { _id: campaignInfo._id, organization },
          {
            ...campaignInfo,
            createdBy: activeUserId,
            organization,
            browsableCols,
            editableCols,
            uniqueCols,
            formModel,
            advancedSettings,
            assignTo,
            groups,
            autodialSettings,
          },
          { new: true, upsert: true, rawResult: true }
        )
        .lean()
        .exec();
    } else {
      campaign = await this.campaignModel.create({
        ...campaignInfo,
        createdBy: activeUserId,
        organization,
        browsableCols,
        editableCols,
        uniqueCols,
        formModel,
        advancedSettings,
        assignTo,
        groups,
        autodialSettings,
      });
    }

    //in case of new campaign creation we will not have the value property
    const campaignId = campaign.value?._id || campaign._doc._id;
    if (isNew) {
      coreConfig.forEach((config) => {
        config.organization = organization;
        config.campaignId = campaignId;
      });

      await this.campaignConfigModel.insertMany(coreConfig);
    }

    const disposition = await this.dispositionModel.findOneAndUpdate(
      { campaign: campaignId, organization },
      {
        options: dispositionData,
        campaign: campaignId,
      },
      { new: true, upsert: true, rawResult: true }
    );

    return {
      campaign: campaign.value,
      disposition,
    };
  }

  async saveCampaignSchema(
    ccJSON: any[],
    others: any & { organization: string }
  ) {
    const created = [];
    const updated = [];
    const error = [];

    for (const cc of ccJSON) {
      if (cc.type === "select") {
        cc.options = cc.options.split(", ");
      }
      const { lastErrorObject, value } = await this.campaignConfigModel
        .findOneAndUpdate(
          {
            name: others.schemaName,
            internalField: cc.internalField,
            organization: others.schema,
          },
          { ...cc, organization: others.organization },
          { new: true, upsert: true, rawResult: true }
        )
        .lean()
        .exec();
      if (lastErrorObject.updatedExisting === true) {
        updated.push(value);
      } else if (lastErrorObject.upserted) {
        created.push(value);
      } else {
        error.push(value);
      }
    }

    // createExcel files and update them to aws and then store the urls in database with AdminActions
    const created_ws = utils.json_to_sheet(created);
    const updated_ws = utils.json_to_sheet(updated);

    const wb = utils.book_new();
    utils.book_append_sheet(wb, updated_ws, "tickets updated");
    utils.book_append_sheet(wb, created_ws, "tickets created");

    const filename = `campaignSchema.xlsx`;
    const filePath = join(__dirname, "..", "..", "crm_response", filename);

    writeFile(wb, filename);
    return filePath;
  }

  // async getDispositionByCampaignName(
  //   campaignName: string,
  //   organization: string
  // ) {
  //   this.logger.info({ campaignName, organization });
  //   const campaignAgg = this.campaignModel.aggregate();
  //   campaignAgg.match({ campaignName, organization });
  //   campaignAgg.lookup({
  //     from: "dispositions",
  //     localField: "_id",
  //     foreignField: "campaign",
  //     as: "disposition",
  //   });

  //   campaignAgg.project({ disposition: "$disposition" });

  //   const result = await campaignAgg.exec();

  //   return result[0].disposition[0];
  // }

  async updateCampaignForm({ organization, payload, campaign }) {
    return this.campaignFormModel.updateOne(
      { organization, campaign },
      { $set: { payload } },
      { upsert: true }
    );
  }

  async archiveCampaign(organization: string, campaignId: string) {
    return this.campaignModel.findOneAndUpdate(
      { _id: campaignId, organization },
      {
        $set: { archived: true },
      },
      { new: true }
    );
  }

  async getQuickStatsForCampaigns(campaignIds: string[], organization: string) {
    const currentDate = moment().toDate();
    /** also add organization because two campaigns can have same names between different organization */
    const quickStatsAgg = this.leadModel.aggregate();
    quickStatsAgg.match({
      organization,
      campaignId: { $in: campaignIds },
      archived: {$ne: true}
    });
    quickStatsAgg.group({
      _id: { campaign: "$campaign" },
      followUp: {
        $sum: {
          $cond: [
            {
              $and: [
                { $gt: ["$followUp", currentDate] },
                { $ne: ["$nextAction", "__closed__"] },
              ],
            },
            1,
            0,
          ],
        },
      },
      overdue: {
        $sum: {
          $cond: [
            {
              $and: [
                { $lt: ["$followUp", currentDate] },
                { $ne: ["$nextAction", "__closed__"] },
              ],
            },
            1,
            0,
          ],
        },
      },
      total: { $sum: 1 },
    });

    quickStatsAgg.project({
      campaign: "$_id.campaign",
      followUp: "$followUp",
      overdue: "$overdue",
      total: "$total",
      _id: 0,
    });

    const quickStatsArr = await quickStatsAgg.exec();
    return keyBy(quickStatsArr, "campaign");
  }

  async updateConfigs(
    config: UpdateConfigsDto,
    organization: string,
    campaignId: string,
    campaignName: string
  ) {
    if (config._id)
      return this.campaignConfigModel
        .findOneAndUpdate(
          { _id: config._id },
          { ...config, name: campaignName, organization, campaignId },
          { upsert: true }
        )
        .lean()
        .exec();
    else {
      try {
        return this.campaignConfigModel.create({
          ...config,
          name: campaignName,
          organization,
          campaignId,
          checked: true,
        });
      } catch (e) {
        throw new BadRequestException(
          "possibly duplicate field for this campaign"
        );
      }
    }
  }

  createCampaignConfigs() {}

  async deleteConfig(deleteConfigDto: DeleteCampaignConfigDto) {
    let status = false;
    const session = await this.campaignConfigModel.db.startSession();
    try {
      await this.campaignConfigModel.deleteOne({ _id: deleteConfigDto._id });
      await this.campaignModel.findOneAndUpdate(
        { _id: deleteConfigDto.campaignId },
        {
          $pull: {
            browsableCols: deleteConfigDto.internalField,
            editableCols: deleteConfigDto.internalField,
          },
        }
      );
      await session.commitTransaction();
      status = true;
    } catch (e) {
      await session.abortTransaction();
      status = false;
    } finally {
      session.endSession();
    }

    return { status };
  }

  async cloneCampaign(campaignId: string) {
    let campaignConfig = await this.campaignConfigModel
      .find({ campaignId }, { _id: 0, __v: 0, campaignId: 0 })
      .lean()
      .exec();
    const campaign = await this.campaignModel
      .findOne({ _id: campaignId }, { _id: 0, __v: 0 })
      .lean()
      .exec();

    const session = await this.campaignConfigModel.db.startSession();

    session.startTransaction();

    try {
      const time = new Date().getTime() / 1000;
      // adding the time infront of the campaign name to identify the newly created campaign
      const newCampaign = await this.campaignModel.create({
        ...campaign,
        campaignName: `${time}-${campaign.campaignName}`,
      });
      // old campaignId wasnot retrieved and here we will add the copy campaign id
      campaignConfig = campaignConfig.map((c) => {
        return { ...c, campaignId: newCampaign._id };
      });
      await this.campaignConfigModel.insertMany(campaignConfig);
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }

  async deleteCampaignAndAllAssociatedEntities(dcAE: DcaeDto) {
    const session = await this.campaignConfigModel.db.startSession();

    session.startTransaction();
    let leads, campaign, campaignConfig, disposition;
    try {
      leads = await this.leadModel.deleteMany({ campaignId: dcAE.campaignId });
      campaignConfig = await this.campaignConfigModel.deleteMany({
        campaignId: dcAE.campaignId,
      });
      campaign = await this.campaignModel.findByIdAndDelete(dcAE.campaignId);
      disposition = await this.dispositionModel.findOneAndDelete({
        campaign: dcAE.campaignId,
      });
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      Logger.error(e);
      session.endSession(); //finally will not be executed
      throw new PreconditionFailedException(
        "An error occured inside transaction" + e.message
      );
    } finally {
      session.endSession();
    }

    return { leads, campaign, campaignConfig, disposition };
  }

  getCampaignsForOrganization(organization: string) {
    return this.campaignModel
      .find(
        { organization },
        {
          campaignName: 1,
          createdBy: 1,
          startDate: 1,
          endDate: 1,
          comment: 1,
        }
      )
      .lean()
      .exec();
  }
}
