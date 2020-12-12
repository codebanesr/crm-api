import { Injectable, Logger } from "@nestjs/common";
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
  }) {
    const limit = Number(perPage);
    const skip = Number((page - 1) * limit);

    const campaignAgg = this.campaignModel.aggregate();

    const { campaigns = [] } = filters;

    // mongodb understands that assigness is an array so it will go and check every single value
    // in the array and if any one of that is a match, it will keep that record
    campaignAgg.match({
      $or: [{ createdBy: loggedInUserId }, { assignees: loggedInUserId }],
    });

    // if campaign filter is applied, @Todo verify if this is still required, i believe that this schema was changed
    if (campaigns && campaigns.length > 0) {
      campaignAgg.match({ type: { $in: campaigns } });
    }

    campaignAgg.facet({
      metadata: [{ $count: "total" }, { $addFields: { page: Number(page) } }],
      data: [{ $skip: skip }, { $limit: limit }], // add projection here wish you re-shape the docs
    });

    // lists all campaigns with created at, name of campaign etc
    const result = await campaignAgg.exec();

    // finding quick stats
    const campaignNames = result[0].data.map((d) => d.campaignName);
    const quickStatsAgg = await this.getQuickStatsForCampaigns(
      campaignNames,
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

  //   disposition data and campaign infor from body
  async createCampaignAndDisposition({
    activeUserId,
    file,
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
  }: {
    activeUserId: string;
    file: any;
    dispositionData: any;
    campaignInfo: any;
    organization: string;
    editableCols: string;
    browsableCols: string;
    uniqueCols: string;
    formModel: any;
    assignTo: string;
    advancedSettings: string;
    groups: string;
  }) {
    dispositionData = JSON.parse(dispositionData);
    campaignInfo = JSON.parse(campaignInfo);
    editableCols = JSON.parse(editableCols);
    browsableCols = JSON.parse(browsableCols);
    uniqueCols = JSON.parse(uniqueCols);
    formModel = JSON.parse(formModel);
    assignTo = JSON.parse(assignTo);
    advancedSettings = JSON.parse(advancedSettings);
    groups = JSON.parse(groups);

    const campaign = await this.campaignModel.findOneAndUpdate(
      { campaignName: campaignInfo.campaignName, organization },
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
      },
      { new: true, upsert: true, rawResult: true }
    );

    // let disposition = new this.dispositionModel({
    //   options: dispositionData,
    //   campaign: campaign.value.id,
    // });
    // disposition = await disposition.save();

    const disposition = await this.dispositionModel.findOneAndUpdate(
      { campaign: campaign.value.id, organization },
      {
        options: dispositionData,
        campaign: campaign.value.id,
      },
      { new: true, upsert: true, rawResult: true }
    );

    let filePath = "";
    if (file) {
      const ccJSON = await parseExcel(file.path);
      filePath = await this.saveCampaignSchema(ccJSON, {
        schemaName: campaignInfo.campaignName,
        organization,
      });

      const adminActions = new this.adminActionModel({
        userid: activeUserId,
        actionType: "error",
        filePath,
        savedOn: "disk",
        fileType: "campaignConfig",
      });

      adminActions.save();
    }

    return {
      campaign: campaign.value,
      disposition,
      filePath,
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

  async getDispositionByCampaignName(
    campaignName: string,
    organization: string
  ) {
    Logger.debug({ campaignName, organization });
    const campaignAgg = this.campaignModel.aggregate();
    campaignAgg.match({ campaignName, organization });
    campaignAgg.lookup({
      from: "dispositions",
      localField: "_id",
      foreignField: "campaign",
      as: "disposition",
    });

    campaignAgg.project({ disposition: "$disposition" });

    const result = await campaignAgg.exec();

    return result[0].disposition[0];
  }

  async updateCampaignForm({ organization, payload, campaign }) {
    return this.campaignFormModel.updateOne(
      { organization, campaign },
      { $set: { payload } },
      { upsert: true }
    );
  }

  async archiveCampaign(campaign: any) {
    return this.campaignModel.findByIdAndUpdate(
      campaign._id,
      {
        $set: { archived: campaign.archived },
      },
      { new: true }
    );
  }

  async getQuickStatsForCampaigns(
    campaignNames: string[],
    organization: string
  ) {
    /** also add organization because two campaigns can have same names between different organization */
    const quickStatsAgg = this.leadModel.aggregate();
    quickStatsAgg.match({
      organization,
      campaign: { $in: campaignNames },
    });
    quickStatsAgg.group({
      _id: { campaign: "$campaign" },
      followUp: {
        $sum: {
          $cond: [
            { $gt: ["$followUp", new Date("2020-12-17T17:26:57.701Z")] },
            1,
            0,
          ],
        },
      },
      overdue: {
        $sum: {
          $cond: [
            { $lt: ["$followUp", new Date("2020-12-17T17:26:57.701Z")] },
            1,
            0,
          ],
        },
      },
    });

    quickStatsAgg.project({
      campaign: "$_id.campaign",
      followUp: "$followUp",
      overdue: "$overdue",
      _id: 0,
    });

    const quickStatsArr = await quickStatsAgg.exec();
    return keyBy(quickStatsArr, "campaign");
  }


  // <filter>,
  // <update>,
  // {
  //   upsert: <boolean>,
  //   writeConcern: <document>,
  //   collation: <document>,
  //   arrayFilters: [ <filterdocument1>, ... ]
  // }
  updateConfigs(config: UpdateConfigsDto, organization: string, campaignId: string, campaignName: string) {
    if(config._id)
      return this.campaignConfigModel.findOneAndUpdate({_id: config._id}, {...config, name: campaignName, organization, campaignId}, {upsert: true}).lean().exec();
    else
      return this.campaignConfigModel.create({...config, name: campaignName, organization, campaignId, checked: true});
  }
}
