import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Campaign } from "../campaign/interfaces/campaign.interface";
import { CallLog } from "../lead/interfaces/call-log.interface";
import { CampaignConfig } from "../lead/interfaces/campaign-config.interface";
import { EmailTemplate } from "../lead/interfaces/email-template.interface";
import { Lead } from "../lead/interfaces/lead.interface";
import { User } from "../user/interfaces/user.interface";
import { Model } from "mongoose";

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel("Lead")
    private readonly leadModel: Model<Lead>,

    @InjectModel("User")
    private readonly userModel: Model<User>,

    @InjectModel("CampaignConfig")
    private readonly campaignConfigModel: Model<CampaignConfig>,

    @InjectModel("Campaign")
    private readonly campaignModel: Model<Campaign>,

    @InjectModel("EmailTemplate")
    private readonly emailTemplateModel: Model<EmailTemplate>,

    @InjectModel("CallLog")
    private readonly callLogModel: Model<CallLog>
  ) {}

  getAggregatedLeadStatus(organization: string, dateArray: string[]) {
    const leadAgg = this.leadModel.aggregate();
    let startDate, endDate;
    if (dateArray) {
      [startDate, endDate] = dateArray;
      startDate = new Date(startDate);
      endDate = new Date(endDate);
      leadAgg.match({
        updatedAt: { $gte: startDate, $lt: endDate },
      });
    }

    leadAgg.match({ organization });
    leadAgg.group({
      _id: { leadStatus: "$leadStatus" },
      totalAmount: { $sum: "$amount" },
    });

    return leadAgg.exec();
  }

  // top 3 performers
  getAggrgegatedLeadStatusForDepartment(
    organization: string,
    dateArray: string[]
  ) {
    let startDate, endDate;
    const aggregateQuery = this.leadModel.aggregate();
    if (dateArray) {
      [startDate, endDate] = dateArray;
      startDate = new Date(startDate);
      endDate = new Date(endDate);
      aggregateQuery.match({
        updatedAt: { $gte: startDate, $lt: endDate },
      });
    }

    // only considering leads for his organization
    aggregateQuery.match({ organization });

    // grouping leads by user first and calculating count of leads for each user, and taking all fields that we need in the future
    aggregateQuery.group({
      _id: { email: "$email", leadStatus: "$leadStatus" },
      count: { $sum: 1 },
      amount: { $sum: "$amount" },
    });

    // now sort these users by number of leads they have
    aggregateQuery.sort({ count: -1 });

    // take the first 3 users
    aggregateQuery.limit(3);

    // format the data, take everything out of _id object that comes from aggregation
    aggregateQuery.project({
      email: "$_id.email",
      leadStatus: "$_id.leadStatus",
      count: "$count",
      amount: "$amount",
      _id: 0,
    });

    // now group by user to send this object to the frontend for consumption
    aggregateQuery.group({
      _id: "$email",
      leadsWithStatus: { $push: "$$ROOT" },
      allLeadCount: { $sum: "$amount" },
    });

    return aggregateQuery.exec();
  }

  async getLeadInfoByMonth(organization: string, month: number) {
    // apply filter by leadStatus and so on here for the user
    const leadAgg = this.leadModel.aggregate();

    // filter leads for the organization under review
    leadAgg.match({ organization: organization });

    // remove all timestamps and
    // project all usable fields
    leadAgg.project({
      year: {
        $year: "$createdAt",
      },
      month: {
        $month: "$createdAt",
      },
      week: {
        $week: "$createdAt",
      },
      day: {
        $dayOfWeek: "$createdAt",
      },
      weight: { $literal: 1 },
      amount: "$amount",
    });


    // day based aggregation and grouping by day
    leadAgg.group({
      _id: {
        year: "$year",
        month: "$month",
        week: "$week",
        day: "$day",
      },
      totalWeightDaily: {
        $sum: "$weight",
      },
      totalAmountDaily: {
        $sum: "$amount",
      },
    });

    // week based aggregation and grouping by day
    leadAgg.group({
      _id: {
        year: "$_id.year",
        month: "$_id.month",
        week: "$_id.week",
      },
      totalWeightWeekly: {
        $sum: "$totalWeightDaily",
      },
      totalAmountWeekly: {
        $sum: "$totalAmountDaily",
      },
      totalWeightDay: {
        $push: {
          totalWeightDay: "$totalWeightDaily",
          totalAmountDay: "$totalAmountDaily",
          dayOfWeek: "$_id.day",
        },
      }
    });

    // return results for month under query
    leadAgg.match({
      "_id.month": month,
    });

    return leadAgg.exec();
  }
}



