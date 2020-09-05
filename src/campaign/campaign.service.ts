import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Campaign } from "./interfaces/campaign.interface";
import { CampaignConfig } from "src/lead/interfaces/campaign-config.interface";
import parseExcel from "src/utils/parseExcel";
import { writeFile, utils } from "xlsx";
import { Disposition } from "./interfaces/disposition.interface";

@Injectable()
export class CampaignService {
  constructor(
    @InjectModel("Campaign")
    private readonly campaignModel: Model<Campaign>,
    @InjectModel("CampaignConfig")
    private readonly campaignConfigModel: Model<CampaignConfig>,
    @InjectModel("Disposition")
    private readonly dispositionModel: Model<Disposition>
  ) {}


  // sort by default handler
  async findAll(page, perPage, filters, sortBy) {
    const limit = Number(perPage);
    const skip = Number((page - 1) * limit);

    const { createdBy, campaigns = [] } = filters;


    const matchQ = {} as any;

    matchQ.$and = [];
    if(createdBy) {
        matchQ.$and.push({createdBy:createdBy});
    }

    if(campaigns && campaigns.length > 0) {
        matchQ.$and.push({ type: { $in: campaigns } });
    }

    const fq = [
        { $match: matchQ },
        { $sort: { [sortBy]: 1 } },
        {
            '$facet': {
                metadata: [ { $count: "total" }, { $addFields: { page: Number(page) } } ],
                data: [ { $skip: skip }, { $limit: limit } ] // add projection here wish you re-shape the docs
            }
        }
    ];

    if(fq[0]["$match"]["$and"].length === 0) {
        delete fq[0]["$match"]["$and"];
    }
    console.log(JSON.stringify(fq));
    const result = await this.campaignModel.aggregate(fq);
    return { data: result[0].data, metadata: result[0].metadata[0] };
  }

  //   campaign id from params.campaignId

  async findOneByIdOrName(campaignId, identifier) {
    let result;
    switch (identifier) {
      case "campaignName":
        result = await this.campaignModel
          .findOne({ campaignName: campaignId })
          .lean()
          .exec();
        break;
      default:
        result = await this.campaignModel
          .findById(campaignId)
          .lean()
          .exec();
    }
    return result;
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
  async getCampaignTypes(hint) {
    return this.campaignModel
      .find({ campaignName: { $regex: "^" + hint, $options: "I" } })
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

  //   campaignId params
  async getDispositionForCampaign(campaignId: string) {
    Logger.debug({campaignId})
    if (campaignId == "core") {
      return this.defaultDisposition();
    } else {
      return this.dispositionModel.findOne({ campaign: campaignId });
    }
  }

  async uploadConfig(file) {
    const path = file.path;
    const excelObject = parseExcel(path);
  }

  //   disposition data and campaign infor from body
  async createCampaignAndDisposition(
    activeUserId: string,
    file,
    dispositionData: any,
    campaignInfo: any
  ) {
    dispositionData = JSON.parse(dispositionData);
    campaignInfo = JSON.parse(campaignInfo);

    const ccJSON = parseExcel(file.path);

    const campaign = await this.campaignModel.findOneAndUpdate(
      { campaignName: campaignInfo.campaignName },
      { ...campaignInfo, createdBy: activeUserId },
      { new: true, upsert: true, rawResult: true }
    );

    const campaignResult = await this.saveCampaignSchema(ccJSON, {
      schemaName: campaignInfo.campaignName,
    });

    let disposition = new this.dispositionModel({
      options: dispositionData,
      campaign: campaign.value.id,
    });
    disposition = await disposition.save();

    return {
      campaign: campaign.value,
      disposition,
      campaignResult,
    };
  }

  async saveCampaignSchema(ccJSON: any[], others: any) {
    const created = [];
    const updated = [];
    const error = [];

    for (const cc of ccJSON) {
      const { lastErrorObject, value } = await this.campaignConfigModel
        .findOneAndUpdate(
          { name: others.schemaName, internalField: cc.internalField },
          cc,
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

    writeFile(wb, "sheetjs.xlsx");
    console.log(
      "created: ",
      created.length,
      "updated: ",
      updated.length,
      "error:",
      error.length
    );
  }
}
