import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Lead } from "./interfaces/lead.interface";
import { AuthReq } from "./interfaces/auth-request.interface";
import { isArray } from "lodash";
import { writeFileSync } from "fs";
import { Types } from "mongoose";
import { User } from "src/user/interfaces/user.interface";
import { Alarm } from "./interfaces/alarm";
import { sendEmail } from "src/utils/sendMail";
import { IConfig } from "src/utils/renameJson";
import parseExcel from "src/utils/parseExcel";
import { utils, writeFile } from "xlsx";
import { EmailTemplate } from "./interfaces/email-template.interface";
import { CampaignConfig } from "./interfaces/campaign-config.interface";
import { CallLog } from "./interfaces/call-log.interface";
import { GeoLocation } from "./interfaces/geo-location.interface";

@Injectable()
export class LeadService {
  constructor(
    @InjectModel("Lead")
    private readonly leadModel: Model<Lead>,

    @InjectModel("User")
    private readonly userModel: Model<User>,

    @InjectModel("CampaignConfig")
    private readonly campaignConfigModel: Model<CampaignConfig>,

    @InjectModel("EmailTemplate")
    private readonly emailTemplateModel: Model<EmailTemplate>,

    @InjectModel("CallLog")
    private readonly callLogModel: Model<CallLog>,

    @InjectModel("GeoLocation")
    private readonly geoLocationModel: Model<GeoLocation>,

    @InjectModel("Alarm")
    private readonly alarmModel: Model<Alarm>,
  ) {}

  saveEmailAttachments(req: AuthReq, res: Response) {
    const files = req.files;
    return files;
  }

  async reassignLead(
    activeUserEmail: string,
    oldUserEmail: string,
    newUserEmail: string,
    lead: Lead
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
      Logger.error("An error occured in reassign lead");
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
    attachments: any
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
    });

    const result = await emailTemplate.save();

    return result;
  }

  // const result = await Campaign.find({type: {$regex: "^"+hint, $options:"I"}}).limit(20);
  async getAllEmailTemplates(
    limit: number = 10,
    skip: number = 0,
    campaign: string
  ) {
    const query = this.emailTemplateModel.aggregate();
    const result = await query
      .match({ campaign: { $regex: `^${campaign}`, $options: "I" } })
      .sort("type")
      .limit(limit)
      .skip(skip)
      .exec();

    return result;
  }

  async getLeadHistoryById(externalId: string) {
    const history = await this.leadModel.findOne(
      { externalId: externalId },
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

  async getBasicOverview(req: Request, res: Response) {
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
    filters: any,
    activeUserEmail: string,
    roleType: string
  ) {
    const limit = Number(perPage);
    const skip = Number((+page - 1) * limit);

    const { assigned, archived, lead, ticket } = filters;
    const matchQ = { $and: [] } as any;
    if (assigned) {
      const subordinateEmails = await this.getSubordinates(
        activeUserEmail,
        roleType
      );
      matchQ.$and.push({
        email: { $in: [...subordinateEmails, activeUserEmail] },
      });
    } else {
      matchQ.$and.push({ email: { $exists: false } });
    }

    if (searchTerm) {
      matchQ["$and"].push({ $text: { $search: searchTerm } });
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

    const fq = [
      { $match: matchQ },
      {
        $project: projectQ,
      },
      { $sort: { [sortBy]: 1 } },
      { $skip: skip },
      { $limit: limit },
    ];
    console.log(JSON.stringify(fq));
    const leads = await this.leadModel.aggregate(fq);
    return leads;
  }

  async getAllLeadColumns(campaignType: string = "core") {
    const matchQ: any = { name: campaignType };

    const paths = await this.campaignConfigModel.aggregate([
      { $match: matchQ },
    ]);

    return paths;
  }

  async insertOne(body: any, activeUserEmail: string) {
    // assiging it to the user that created the lead by default
    body.email = activeUserEmail;

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

  async findOneById(leadId: string) {
    const lead = await this.leadModel
      .findOne({ externalId: leadId })
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
    const result = await this.leadModel
      .remove({ _id: leadId })
      .lean()
      .exec();

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
    attachments: any
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

  async suggestLeads(activeUserEmail: string, leadId: string, limit = 10) {
    const query = this.leadModel.aggregate();

    query.match({
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
  async uploadMultipleLeadFiles(files: any[], campaignName: string) {
    const ccnfg = (await this.campaignConfigModel
      .find(
        { name: campaignName },
        { readableField: 1, internalField: 1, _id: 0 }
      )
      .lean()
      .exec()) as IConfig[];
    if (!ccnfg) {
      return {
        error: `Campaign with name ${campaignName} not found, create a campaign before uploading leads for that campaign`,
      };
    }

    const result = await this.parseLeadFiles(files, ccnfg, campaignName);
    // parse data here
    return { files, result };
  }

  async syncPhoneCalls(callLogs: any) {
    try {
      writeFileSync("callLogs.json", JSON.stringify(callLogs));
      const result = await this.callLogModel.insertMany(callLogs);
      return result;
    } catch (e) {
      Logger.error(
        "An error occured while syncing phone calls in leadService.ts",
        e.message
      );
      return e.message;
    }
  }

  async addGeolocation(activeUserId: string, lat: number, lng: number) {
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

  async updateLead(externalId: string, lead: Lead) {
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

  async parseLeadFiles(files: any[], ccnfg: IConfig[], campaignName: string) {
    files.forEach(async (file: any) => {
      const jsonRes = parseExcel(file.path, ccnfg);
      this.saveLeadsFromExcel(jsonRes, campaignName, file.originalname);
    });
  }

  async saveLeadsFromExcel(
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
}
