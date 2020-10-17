import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Lead } from "./interfaces/lead.interface";
import { isArray } from "lodash";
import { Types } from "mongoose";
import { User } from "../user/interfaces/user.interface";
import { Alarm } from "./interfaces/alarm";
import { sendEmail } from "../utils/sendMail";
import { IConfig } from "../utils/renameJson";
import parseExcel from "../utils/parseExcel";
import { utils, writeFile } from "xlsx";
import { EmailTemplate } from "./interfaces/email-template.interface";
import { CampaignConfig } from "./interfaces/campaign-config.interface";
import { CallLog } from "./interfaces/call-log.interface";
import { GeoLocation } from "./interfaces/geo-location.interface";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { SyncCallLogsDto } from "./dto/sync-call-logs.dto";
import { Campaign } from "../campaign/interfaces/campaign.interface";
import { FiltersDto } from "./dto/find-all.dto";

@Injectable()
export class LeadService {
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
    private readonly callLogModel: Model<CallLog>,

    @InjectModel("GeoLocation")
    private readonly geoLocationModel: Model<GeoLocation>,

    @InjectModel("Alarm")
    private readonly alarmModel: Model<Alarm>
  ) {}

  saveEmailAttachments(files) {
    return files;
  }

  async reassignLead(
    activeUserEmail: string,
    oldUserEmail: string,
    newUserEmail: string,
    lead: Partial<Lead>
  ) {
    try {
      const assigned = oldUserEmail ? "reassigned" : "assigned";
      let note = "";
      if (oldUserEmail) {
        note = `Lead ${assigned} from ${oldUserEmail} to ${newUserEmail} by ${activeUserEmail}`;
      } else {
        note = `Lead ${assigned} to ${newUserEmail} by ${activeUserEmail}`;
      }
      const history = {
        oldUser: oldUserEmail,
        newUser: newUserEmail,
        note,
      };

      const result = await this.leadModel
        .updateOne(
          { externalId: lead.externalId },
          { email: newUserEmail, $push: { history: history } }
        )
        .lean()
        .exec();
      return result;
    } catch (e) {
      return e.message;
    }
  }

  // filePath: String,
  // fileName: String
  async createEmailTemplate(
    userEmail: string,
    content: any,
    subject: string,
    campaign: string,
    attachments: any,
    organization: string
  ) {
    let acceptableAttachmentFormat = attachments.map((a: any) => {
      let { originalname: fileName, path: filePath, ...others } = a;
      return {
        fileName,
        filePath,
        ...others,
      };
    });
    const emailTemplate = new this.emailTemplateModel({
      campaign: campaign,
      email: userEmail,
      content: content,
      subject: subject,
      attachments: acceptableAttachmentFormat,
      organization,
    });

    return emailTemplate.save();
  }

  // const result = await Campaign.find({type: {$regex: "^"+hint, $options:"I"}}).limit(20);
  async getAllEmailTemplates(
    limit,
    skip,
    searchTerm: string,
    organization: string,
    campaignName
  ) {
    const query = this.emailTemplateModel.aggregate();
    const matchQ = {
      subject: { $regex: `^${searchTerm}`, $options: "I" },
      organization,
    };
    if (campaignName !== "undefined") {
      matchQ["campaign"] = campaignName;
    }

    const result = await query
      .match(matchQ)
      .sort("type")
      .limit(+limit)
      .skip(+skip)
      .exec();

    return result;
  }

  async getLeadHistoryById(externalId: string, organization) {
    const history = await this.leadModel.findOne(
      { externalId: externalId, organization },
      { history: 1, externalId }
    );

    return history;
  }

  async getLeadReassignmentHistory(email: string) {
    const leadId = email;
    try {
      const result = await this.leadModel.aggregate([
        { $match: { _id: leadId } },
        { $project: { history: 1 } },
        { $unwind: "$history" },
        { $sort: { time: 1 } },
        { $limit: 5 },
        { $replaceRoot: { newRoot: "$history" } },
      ]);

      return result;
    } catch (e) {
      Logger.error("An error occured in getLeadReassignmentHistory");
      return e.message;
    }
  }

  async getBasicOverview() {
    const result = await this.leadModel.aggregate([
      { $group: { _id: "$leadStatus", count: { $sum: 1 } } },
    ]);

    const total = await this.leadModel.count({});
    return { result, total };
  }

  async findAll(
    page: number,
    perPage: number,
    sortBy = "createdAt",
    showCols: string[],
    searchTerm: string,
    filters: FiltersDto,
    activeUserEmail: string,
    roleType: string,
    organization: string
  ) {
    const limit = Number(perPage);
    const skip = Number((+page - 1) * limit);
    const { assigned, selectedCampaign, dateRange } = filters;
    const [startDate, endDate] = dateRange || [];

    const leadAgg = this.leadModel.aggregate();
    leadAgg.match({ organization });

    if (assigned) {
      const subordinateEmails = await this.getSubordinates(
        activeUserEmail,
        roleType
      );

      leadAgg.match({
        email: { $in: [...subordinateEmails, activeUserEmail] },
      });
    }

    if (startDate) {
      leadAgg.match({
        createdAt: { $gt: new Date(startDate) },
      });
    }

    if (endDate) {
      leadAgg.match({
        createdAt: { $lt: new Date(endDate) },
      });
    }

    /** Move it into a cached service call */
    if (selectedCampaign) {
      const campaign = await this.campaignModel
        .findOne({ _id: selectedCampaign }, { campaignName: 1 })
        .lean()
        .exec();

      leadAgg.match({ campaign: campaign.campaignName });
    }

    if (searchTerm) {
      leadAgg.match({ $text: { $search: searchTerm } });
    }

    let flds;
    if (showCols && showCols.length > 0) {
      flds = showCols;
    } else {
      flds = (
        await this.campaignConfigModel
          .find({ name: "core", checked: true }, { internalField: 1 })
          .lean()
          .exec()
      ).map((config: any) => config.internalField);
    }

    const projectQ = {} as any;
    flds.forEach((fld: string) => {
      projectQ[fld] = { $ifNull: [`$${fld}`, "---"] };
    });

    projectQ._id = 0;

    leadAgg.project(projectQ);
    leadAgg.sort({ [sortBy]: 1 });
    leadAgg.facet({
      metadata: [{ $count: "total" }, { $addFields: { page: Number(page) } }],
      data: [{ $skip: skip }, { $limit: limit }], // add projection here wish you re-shape the docs
    });

    const response = await leadAgg.exec();

    return {
      total: response[0]?.metadata[0]?.total,
      page: response[0]?.metadata[0]?.page,
      data: response[0]?.data,
    };
  }

  async getLeadColumns(campaignType: string = "core", organization: string) {
    if (campaignType !== "core") {
      const campaign: any = await this.campaignModel
        .findOne({ _id: Types.ObjectId(campaignType), organization })
        .lean()
        .exec();
      campaignType = campaign.campaignName;
    }
    const matchQ: any = { name: campaignType };

    const paths = await this.campaignConfigModel
      .aggregate([{ $match: matchQ }])
      .exec();

    return { paths: paths };
  }

  async insertOne(body: any, activeUserEmail: string, organization: string) {
    // assiging it to the user that created the lead by default
    body.email = activeUserEmail;
    body.organization = organization;

    const lead = new this.leadModel(body);
    const result = await lead.save();

    // move to worker
    await this.createAlarm({
      module: "LEAD",
      tag: "LEAD_CREATE",
      severity: "LOW",
      userEmail: activeUserEmail,
      moduleId: result._id,
    });
    return result;
  }

  async findOneById(leadId: string, organization: string) {
    const lead = await this.leadModel
      .findOne({ externalId: leadId, organization })
      .lean()
      .exec();
    return lead;
  }

  async patch(productId: string, body: any[]) {
    const updateOps: { [index: string]: any } = {};
    for (const ops of body) {
      const propName = ops.propName;
      updateOps[propName] = ops.value;
    }
    return this.leadModel
      .update({ _id: productId }, { $set: updateOps })
      .exec();
  }

  async deleteOne(leadId: string, activeUserEmail: string) {
    const result = await this.leadModel.remove({ _id: leadId }).lean().exec();

    await this.createAlarm({
      module: "LEAD",
      tag: "LEAD_CREATE",
      severity: "LOW",
      userEmail: activeUserEmail,
      moduleId: leadId,
    });

    return result;
  }

  async createAlarm(alarmObj: Partial<Alarm>) {
    const alarm = new this.alarmModel(alarmObj);

    const result = await alarm.save();

    return result;
  }

  // {
  //     filename: 'text3.txt',
  //     path: '/path/to/file.txt'
  // }
  async sendBulkEmails(
    emails: string[],
    subject: string,
    text: string,
    attachments: any,
    organization: string
  ) {
    emails = isArray(emails) ? emails : [emails];
    const sepEmails = emails.join(",");
    try {
      sendEmail(sepEmails, subject, text, attachments);
      return { success: true };
    } catch (e) {
      Logger.error(
        "Some error occured while sending bulk emails in sendBulkEmails",
        e.message
      );
      return { error: e.message };
    }
  }

  async suggestLeads(
    activeUserEmail: string,
    leadId: string,
    organization: string,
    limit = 10
  ) {
    const query = this.leadModel.aggregate();

    query.match({
      organization,
      externalId: { $regex: `^${leadId}` },
      email: activeUserEmail,
    });
    query.project("externalId -_id");
    query.limit(Number(limit));
    // const query = [
    //     {
    //         $match: {
    //             externalId: {$regex: `^${externalId}`}
    //         }
    //     },
    //     { $project : { leadId : 1} },
    //     { $limit: 10 }
    // ];

    let result = await query.exec();
    return result;
  }

  // {
  //   campaignName: 'typeb',
  //   comment: 'some info about the campaign, should reach multer',
  //   type: 'Lead Generation',
  //   interval: [ '2020-07-24T13:31:02.621Z', '2020-07-04T13:26:07.078Z' ]
  // }
  async uploadMultipleLeadFiles(
    files: any[],
    campaignName: string,
    uploader: string,
    organization: string
  ) {
    const ccnfg = (await this.campaignConfigModel
      .find(
        { name: campaignName, organization },
        { readableField: 1, internalField: 1, _id: 0 }
      )
      .lean()
      .exec()) as IConfig[];
    if (!ccnfg) {
      return {
        error: `Campaign with name ${campaignName} not found, create a campaign before uploading leads for that campaign`,
      };
    }

    const result = await this.parseLeadFiles(
      files,
      ccnfg,
      campaignName,
      organization,
      uploader
    );
    // parse data here
    return { files, result };
  }

  async syncPhoneCalls(callLogs: SyncCallLogsDto[], organization, user) {
    try {
      const transformed = callLogs.map((callLog) => {
        return { ...callLog, organization, user };
      });
      return this.callLogModel.insertMany(transformed);
    } catch (e) {
      Logger.error(
        "An error occured while syncing phone calls in leadService.ts",
        e.message
      );
      return e.message;
    }
  }

  async addGeolocation(
    activeUserId: string,
    lat: number,
    lng: number,
    organization: string
  ) {
    var geoObj = new this.geoLocationModel({
      userid: Types.ObjectId(activeUserId),
      location: {
        type: "Point",
        // Place longitude first, then latitude
        coordinates: [lng, lat],
      },
    });
    const result = await geoObj.save();

    return result;
  }

  async getPerformance() {}

  async updateLead(externalId: string, lead: Partial<CreateLeadDto>) {
    let obj = {} as any;
    Object.keys(lead).forEach((key) => {
      if (!!lead[key]) {
        obj[key] = lead[key];
      }
    });

    const result = await this.leadModel.findOneAndUpdate(
      { externalId: externalId },
      { $set: obj }
    );

    return result;
  }

  /** Findone and update implementation */
  async saveLeads(
    leads: any[],
    campaignName: string,
    originalFileName: string
  ) {
    const created = [];
    const updated = [];
    const error = [];

    for (const l of leads) {
      const { lastErrorObject, value } = await this.leadModel
        .findOneAndUpdate(
          { externalId: l.externalId },
          { ...l, campaign: campaignName },
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

    writeFile(wb, originalFileName + "_system");
    console.log(
      "created: ",
      created.length,
      "updated: ",
      updated.length,
      "error:",
      error.length
    );
  }

  async getSubordinates(email: string, roleType: string) {
    if (roleType !== "manager" && roleType !== "seniorManager") {
      return [email];
    }
    const fq: any = [
      { $match: { email: email } },
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

  async parseLeadFiles(
    files: any[],
    ccnfg: IConfig[],
    campaignName: string,
    organization: string,
    uploader: string
  ) {
    files.forEach(async (file: any) => {
      const jsonRes = parseExcel(file.path, ccnfg);
      this.saveLeadsFromExcel(
        jsonRes,
        campaignName,
        file.originalname,
        organization,
        uploader
      );
    });
  }

  async saveLeadsFromExcel(
    leads: any[],
    campaignName: string,
    originalFileName: string,
    organization: string,
    uploader: string
  ) {
    const created = [];
    const updated = [];
    const error = [];

    for (const l of leads) {
      const { lastErrorObject, value } = await this.leadModel
        .findOneAndUpdate(
          { externalId: l.externalId },
          { ...l, campaign: campaignName, organization, uploader },
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

    writeFile(wb, originalFileName + "_system");
    console.log(
      "created: ",
      created.length,
      "updated: ",
      updated.length,
      "error:",
      error.length
    );
  }

  async leadActivityByUser(startDate: string, endDate: string, email: string) {
    const updatedAtQuery = this.getUpdatedAtQuery(
      startDate as string,
      endDate as string
    );
    const qb = this.leadModel.aggregate();
    qb.match({
      email,
      ...updatedAtQuery,
    });
    qb.group({
      _id: { leadStatus: "$leadStatus" },
      myCount: { $sum: 1 },
    });
    return qb.exec();
  }

  async getUpdatedAtQuery(startDate: string, endDate: string) {
    const uq = { updatedAt: { $gt: new Date("1000-01-01T00:00:00.000Z") } };
    if (startDate) {
      uq.updatedAt["$gt"] = new Date(startDate);
    }

    if (endDate) {
      uq.updatedAt["$lt"] = new Date(endDate);
    }
    return uq;
  }

  async fetchNextLead(
    campaignId: string,
    leadStatus: string,
    email: string,
    organization: string
  ) {
    const campaign: any = await this.campaignModel
      .findOne({ _id: campaignId, organization })
      .lean()
      .exec();
    const result = await this.leadModel
      .findOne({
        campaign: campaign.campaignName,
        leadStatus,
        $or: [
          { email: email },
          {
            email: { $exists: false },
          },
        ],
      })
      .sort({ _id: -1 })
      .lean()
      .exec();
    return { result };
  }

  getSaleAmountByLeadStatus(campaignName?: string) {
    const qb = this.leadModel.aggregate();
    if (campaignName) {
      qb.match({ campaign: campaignName });
    }
    qb.group({
      _id: "$leadStatus",
      totalSaleAmount: {
        $sum: "$amount",
      },
    });
    return qb.exec();
  }

  // date will always be greater than today
  async getFollowUps({ interval, organization, email, campaignName }) {
    const leadAgg = this.leadModel.aggregate();
    var todayStart = new Date();
    todayStart.setHours(0);
    todayStart.setMinutes(0);
    todayStart.setSeconds(1);

    var todayEnd = new Date();
    todayEnd.setHours(23);
    todayEnd.setMinutes(59);
    todayEnd.setSeconds(59);

    if (campaignName) {
      leadAgg.match({ campaign: campaignName });
    }

    if (interval?.length === 2) {
      leadAgg.match({
        followUp: {
          $gte: new Date(interval[0]),
          $lte: new Date(interval[1]),
        },
      });
    } else {
      leadAgg.match({
        followUp: {
          $gte: todayStart,
        },
      });
    }

    leadAgg.match({ organization, email });
    leadAgg.sort({ followUp: 1 });

    return leadAgg.exec();
  }

  async getAllAlarms(body, organization) {
    const { page = 1, perPage = 20, filters = {}, sortBy = "createdAt" } = body;

    const limit = Number(perPage);
    const skip = Number((page - 1) * limit);

    const fq = [
      { $match: { organization } },
      { $sort: { [sortBy]: 1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    return await this.alarmModel.aggregate(fq).exec();
  }

  // https://docs.mongodb.com/manual/core/aggregation-pipeline-optimization/#match-match-coalescence,
  // it is ok to use consecutive match statements
  async getUsersActivity(
    dateRange: Date[],
    userEmail: string,
    organization: string
  ) {
    let startDate, endDate;
    const userAgg = this.leadModel.aggregate();
    userAgg.match({ email: userEmail, organization });
    if (dateRange) {
      [startDate, endDate] = dateRange;
      userAgg.match({ createdAt: { $gte: startDate, $lt: endDate } });
    }

    // project fields that we want
    userAgg.project({ amount: "$amount", leadStatus: "$leadStatus" });

    // group by lead status
    userAgg.group({ _id: "$leadStatus", amount: { $sum: "$amount" } });

    return userAgg.exec();
  }
}
