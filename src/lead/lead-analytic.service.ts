import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { maxBy } from "lodash";
import { Aggregate, Model, Types, Schema } from "mongoose";
import { GetGraphDataDto } from "./dto/get-graph-data.dto";
import { LeadHistory } from "./interfaces/lead-history.interface";
import { Lead } from "./interfaces/lead.interface";
import * as moment from "moment";

@Injectable()
export class LeadAnalyticService {
  @InjectModel("Lead")
  private readonly leadModel: Model<Lead>;

  @InjectModel("LeadHistory")
  private readonly leadHistoryModel: Model<LeadHistory>;


  attachCommonGraphFilters(pipeline: Aggregate<any[]>, organization: string, filter: GetGraphDataDto) {
    pipeline.match({
      organization,
      updatedAt: {$gte: filter.startDate, $lt: filter.endDate}
    });

    if(filter.handler?.length > 0) {
      pipeline.match({email: {$in: filter.handler}});
    }

    if(filter.campaign) {
      pipeline.match({campaignId: Types.ObjectId(filter.campaign)})
    }
  }
  


  async getGraphData(organization: string, getGraphDto: GetGraphDataDto) {
    const { handler: userList, campaign, endDate, startDate } = getGraphDto;
    
    /** @Todo use same aggregation for both queries */
    // const barAgg = this.leadModel.aggregate();
    // barAgg.match({
    //   organization,
    //   email: { $in: userList },
    //   updatedAt: { $gte: startDate, $lte: endDate },
    // });
    // barAgg.group({ _id: { type: "$leadStatus" }, value: { $sum: 1 } });
    // barAgg.project({ type: "$_id.type", value: "$value", _id: 0 });

    const pieAgg = this.leadModel.aggregate();
    const pieFilters = {
      campaignId: Types.ObjectId(campaign),
      organization,
      email: { $in: userList },
      updatedAt: { $gte: startDate, $lte: endDate },
    };

    if(!userList || userList.length === 0) {
      delete pieFilters.email;
    }
    
    pieAgg.match(pieFilters);
    pieAgg.group({ _id: { type: "$leadStatus" }, value: { $sum: 1 } });
    pieAgg.project({ type: "$_id.type", value: "$value", _id: 0 });
    pieAgg.sort({value: 1});

    const stackBarData = this.leadHistoryModel.aggregate();
    const stackFilters = {
      campaign: Types.ObjectId(campaign),
      organization,

      /** @Todo this is slightly wrong since in case of old use we should only consider old user */
      newUser: { $in: userList },
      createdAt: { $gte: startDate, $lte: endDate },
    };

    if(!userList || userList.length === 0) {
      delete stackFilters.newUser;
    }
    stackBarData.match(stackFilters);
    stackBarData.project({
      month: { $month: "$createdAt" },
      year: { $year: "$createdAt" },
      leadStatus: "$leadStatus",
    });
    stackBarData.group({
      _id: { month: "$month", year: "$year", leadStatus: "$leadStatus" },
      NOC: { $sum: 1 },
    });
    stackBarData.project({
      month: {
        $concat: [
          { $toString: "$_id.year" },
          " - ",
          { $toString: "$_id.month" },
        ],
      },
      NOC: "$NOC",
      type: "$_id.leadStatus",
    });

    let [pieData, stackData] = await Promise.all([
      pieAgg.exec(),
      stackBarData.exec(),
    ]);

    // pieData.forEach(d => {
    //   if(d.type === null) {
    //     d.type = 'None';
    //   }
    // });


    pieData = pieData.filter(p=>!!p.type)

    /** @Todo send the same data for both pie and chart and consume on the frontend */ 
    return { pieData, barData: pieData, stackData };
  }

  async getLeadStatusDataForLineGraph(
    email: string,
    organization: string,
    year: string
  ) {
    // @Todo organization filter is required
    return this.leadHistoryModel
      .aggregate([
        { $match: { organization } },
        {
          $project: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            leadStatus: "$leadStatus",
          },
        },
        { $match: { year: +year } },
        {
          $group: {
            _id: {
              month: "$month",
              year: "$year",
              leadStatus: "$leadStatus",
            },
            total: { $sum: 1 },
          },
        },
        {
          $addFields: {
            month: {
              $let: {
                vars: {
                  monthsInString: [
                    ,
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ],
                },
                in: {
                  $arrayElemAt: ["$$monthsInString", "$_id.month"],
                },
              },
            },
          },
        },
        { $sort : { "_id.month" : 1 } },
        {
          $project: {
            total: "$total",
            month: "$month",
            leadStatus: "$_id.leadStatus",
            _id: 0,
          },
        },
      ])
      .exec();
  }

  async getLeadStatusCountForTelecallers(email: string, organization: string) {
    const pipeline = this.leadModel.aggregate();
    pipeline.match({organization});

    // adds another field called nextActionExists, every record will now have this field based on which we can calculate
    // leads for every user
    /** @Todo isPristine flag can also be used to check if the lead is untouched after its creation */
    pipeline.addFields({
      nextActionExists: {
        $cond: [
          {
            $ne: ["$nextAction", "__closed__"],
          },
          true,
          false,
        ],
      },
    });

    pipeline.addFields({
      open: { $cond: [{ $eq: ["$nextActionExists", true] }, 1, 0] },
      closed: { $cond: [{ $eq: ["$nextActionExists", false] }, 1, 0] },
    });

    // here we are counting open and closed leads for every user individually
    pipeline.group({
      _id: { email: "$email" },
      totalOpen: { $sum: "$open" },
      totalClosed: { $sum: "$closed" },
    });

    // this is a simple project phase
    pipeline.project({
      totalOpen: "$totalOpen",
      totalClosed: "$totalClosed",
      nextActionExists: "$_id.nextActionExists",
      email: "$_id.email",
      _id: 0,
    });

    const items = await pipeline.exec();
    const totalLeadsInOrg = await this.leadModel.countDocuments().lean().exec();
    return {
      totalLeadsInOrg,
      items,
      total_count: items.length,
    };
  }

  async getCampaignWiseLeadCount(email: string, organization: string, filters: GetGraphDataDto) {
    const pipeline = this.leadModel.aggregate()
    this.attachCommonGraphFilters(pipeline, organization, filters);
    pipeline.group({
      _id: "$campaign",
      total: { $sum: 1 },
    });
    pipeline.project({type: "$_id", "value": "$total", percentage: "1" });
    return pipeline.exec();
  }


  async getCampaignWiseLeadCountPerLeadCategory(email: string, organization: string, filter: GetGraphDataDto) {
    const XAxisLabel = 'Campaign Name';
    const YAxisLabel = 'Total Leads';

    const pipeline = this.leadModel.aggregate();

    this.attachCommonGraphFilters(pipeline, organization, filter);

    pipeline.group({
        _id: { campaign: "$campaign", leadStatus: "$leadStatus"},
        total: { $sum: 1 },
    });

    pipeline.project({
      _id:0, type: "$_id.leadStatus", [YAxisLabel]: "$total", [XAxisLabel]: "$_id.campaign"
    })
    
    const stackBarData = await pipeline.exec();
    let max = 10;

    if(stackBarData.length > 0) {
      max = maxBy(stackBarData, (o) => o[YAxisLabel])[YAxisLabel];
    }

    return {
      XAxisLabel,
      YAxisLabel,
      stackBarData,
      max: max*2 // this is just a quick fix, we need to find the max height of the bar, not max of entries individually
    }
  }

  async getUserTalktime(email: string, organization: string, filter: GetGraphDataDto) {
    const pipeline = this.leadHistoryModel.aggregate();
    
    pipeline.match({
      organization,
      createdAt: {$gte: filter.startDate, $lt: filter.endDate}
    });

    if(filter.handler?.length > 0) {
      pipeline.match({email: {$in: filter.handler}});
    }


    // this is wrong and was done willfully so, change this to old user, because if reassignment was done, talktime should go to the 
    // previous user
    pipeline.group({
      _id: {"email": "$newUser"},
      talktime: {$sum: "$duration"},
      totalCalls: {$sum: 1}
    });

    pipeline.project({
      value: "$talktime",
      averageValue: {$divide: ["$talktime", "$totalCalls"]},
      type: "$_id.email",
      _id: 0
    })

    const result = await pipeline.exec();

    return result;
  }
}