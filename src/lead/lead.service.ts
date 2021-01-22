import {
  ImATeapotException,
  Injectable,
  Logger,
  PreconditionFailedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, NativeError } from "mongoose";
import { Lead } from "./interfaces/lead.interface";
import { get, intersection, isArray, isEmpty, values } from "lodash";
import { Types } from "mongoose";
import { User } from "../user/interfaces/user.interface";
import { Alarm } from "./interfaces/alarm";
import { sendEmail } from "../utils/sendMail";
import { IConfig } from "../utils/renameJson";
import parseExcel from "../utils/parseExcel";
import { utils, write } from "xlsx";
import { EmailTemplate } from "./interfaces/email-template.interface";
import { CampaignConfig } from "./interfaces/campaign-config.interface";
import { CallLog } from "./interfaces/call-log.interface";
import { GeoLocation } from "./interfaces/geo-location.interface";
import { UpdateLeadDto, ReassignmentInfo } from "./dto/update-lead.dto";
import { Campaign } from "../campaign/interfaces/campaign.interface";
import { FiltersDto } from "./dto/find-all.dto";
import { AttachmentDto } from "./dto/create-email-template.dto";
import { createTransport, SendMailOptions } from "nodemailer";
import { default as config } from "../config";
import { S3UploadedFiles } from "./dto/generic.dto";
import { AdminAction } from "../user/interfaces/admin-actions.interface";
import { UploadService } from "../upload/upload.service";
import { PushNotificationService } from "../push-notification/push-notification.service";
import { UpdateContactDto } from "./dto/update-contact.dto";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { LeadHistory } from "./interfaces/lead-history.interface";
import { GetTransactionDto } from "./dto/get-transaction.dto";
import { RulesService } from "../rules/rules.service";
@Injectable()
export class LeadService {
  constructor(
    @InjectModel("Lead")
    private readonly leadModel: Model<Lead>,

    @InjectModel("AdminAction")
    private readonly adminActionModel: Model<AdminAction>,

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

    @InjectModel("LeadHistory")
    private readonly leadHistoryModel: Model<LeadHistory>,

    @InjectModel("GeoLocation")
    private readonly geoLocationModel: Model<GeoLocation>,

    @InjectModel("Alarm")
    private readonly alarmModel: Model<Alarm>,

    private readonly ruleService: RulesService,

    private readonly s3UploadService: UploadService,

    private readonly pushNotificationService: PushNotificationService
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
      let notes = "";
      if (oldUserEmail) {
        notes = `Lead ${assigned} from ${oldUserEmail} to ${newUserEmail} by ${activeUserEmail}`;
      } else {
        notes = `Lead ${assigned} to ${newUserEmail} by ${activeUserEmail}`;
      }
      const history: Partial<LeadHistory> = {
        oldUser: oldUserEmail,
        newUser: newUserEmail,
        notes,
      };

      const result = await this.leadModel
        .updateOne(
          { _id: lead._id },
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
    attachments: AttachmentDto[],
    organization: string,
    templateName: string
  ) {
    let acceptableAttachmentFormat = attachments.map((a) => {
      let { key: fileName, Location: filePath, ...others } = a;
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
      templateName,
    });

    return emailTemplate.save();
  }

  // const result = await Campaign.find({type: {$regex: "^"+hint, $options:"I"}}).limit(20);
  async getAllEmailTemplates(
    limit,
    skip,
    campaign: string,
    organization: string
  ) {
    return this.emailTemplateModel
      .find({ campaign, organization })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
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
    organization: string,
    typeDict,
    campaignId: string
  ) {
    const limit = Number(perPage);
    const skip = Number((+page - 1) * limit);
    const { assigned, selectedCampaign, dateRange, leadStatusKeys, ...otherFilters } = filters;
    const [startDate, endDate] = dateRange || [];

    const leadAgg = this.leadModel.aggregate();
    // match with text is only allowed as the first pipeline stage
    if (searchTerm) {
      leadAgg.match({ $text: { $search: searchTerm } });
    }

    const matchQuery = { organization };

    if(campaignId!=='all') {
      matchQuery['campaignId'] = Types.ObjectId(campaignId);
    }

    if(leadStatusKeys?.length > 0) {
      matchQuery["leadStatusKeys"] = {$in: leadStatusKeys};
    }

    Object.keys(otherFilters).forEach((k) => {
      if (!otherFilters[k]) {
        delete otherFilters[k];
      }
    });

    Object.keys(otherFilters).forEach((key) => {
      switch (typeDict[key].type) {
        case "string":
        case "select":
        case "tel":
          /** @Todo coalesce all match queries in order of best match to worst match */
          const expr = new RegExp(otherFilters[key]);
          matchQuery[key] = { $regex: expr, $options: "i" };
          break;
        case "date":
          const dateInput = otherFilters[key];
          if (dateInput.length === 2) {
            const startDate = new Date(dateInput[0]);
            const endDate = new Date(dateInput[1]);

            matchQuery[key] = { $gte: startDate, $lt: endDate };
          } else if (dateInput.length === 1) {
            matchQuery[key] = { $eq: new Date(dateInput[0]) };
          }
          break;
      }
    });

    leadAgg.match(matchQuery);

    if (assigned) {
      const subordinateEmails = await this.getSubordinates(
        activeUserEmail,
        roleType,
        organization
      );

      // leadAgg.match({
      //   email: { $in: [...subordinateEmails, activeUserEmail] },
      // });


      /** @Todo this should be changed to use userid and not email */
      leadAgg.match({
        $or: [
          { email: { $in: [...subordinateEmails, activeUserEmail] } },
          { email: { $exists: false } },
        ],
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
      // projectQ[fld] = { $ifNull: [`$${fld}`, "---"] };
      projectQ[fld] = 1;
    });

    if (Object.keys(projectQ).length > 0) {
      leadAgg.project(projectQ);
    }

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

  async getLeadColumns(campaignId) {
    const paths = await this.campaignConfigModel.find({campaignId});
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
      .findById(leadId)
      .lean()
      .exec();


    let leadHistory = []
    if(lead) {
      leadHistory = await this.leadHistoryModel
      .find({ lead: lead._id })
      .limit(5);
    }
    return {lead, leadHistory};
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

  async createLead(
    body: CreateLeadDto,
    email: string,
    organization: string,
    campaignId: string,
    campaignName: string
  ) {
    const { contact, lead } = body;

    /** lead gets assigned to whoever creates it, he can go back and reassign the lead if he wishes to */
    lead.email = email;
    lead.firstName = lead.firstName || 'Undefined';

    if(!lead.fullName) {
      lead.fullName = `${lead.firstName} ${lead.lastName}`;
    }
    
    return this.leadModel.create({
      ...lead,
      campaign: campaignName,
      organization,
      contact,
    });
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
    files: S3UploadedFiles[],
    campaignName: string,
    uploader: string,
    organization: string,
    userId: string,
    pushtoken: any,
    campaignId: string
  ) {
    const uniqueAttr = await this.campaignModel.findOne({_id: campaignId}, {uniqueCols: 1}).lean().exec();
    const ccnfg = await this.campaignConfigModel.find({campaignId}, {readableField: 1, internalField: 1, _id: 0}).lean().exec();

    if (!ccnfg) {
      throw new Error(
        `Campaign with name ${campaignName} not found, create a campaign before uploading leads for that campaign`
      );
    }

    await this.adminActionModel.create({
      userid: userId,
      organization,
      actionType: "lead",
      filePath: files[0].Location,
      savedOn: "s3",
      campaign: campaignId,
      fileType: "campaignConfig",
    });

    const result = await this.parseLeadFiles(
      files,
      ccnfg,
      campaignName,
      organization,
      uploader,
      userId,
      pushtoken,
      campaignId,
      uniqueAttr
    );
    // parse data here
    return { files, result };
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

  /** @Todo trim all string fields otherwise they will give trouble with equality later on */
  async updateLead({
    organization,
    leadId,
    lead,
    geoLocation,
    loggedInUserEmail,
    reassignmentInfo,
    emailForm,
    requestedInformation,
    campaignId,
    callRecord
  }: UpdateLeadDto & {
    leadId: string;
    organization: string;
    loggedInUserEmail: string;
  }) {
    let obj = {} as Partial<Lead>;
    Logger.debug({ geoLocation, reassignmentInfo });
    const keysToUpdate = Object.keys(lead);

    if (keysToUpdate.length > 40) {
      throw new PreconditionFailedException(
        null,
        "Cannot have more than 40 fields in the lead schema"
      );
    }
    keysToUpdate.forEach((key) => {
      if (!!lead[key]) {
        obj[key] = lead[key];
      }
    });

    const oldLead = await this.leadModel
      .findOne({ _id: leadId, organization })
      .lean()
      .exec();

    const nextEntryInHistory = {
      geoLocation: {},
    } as LeadHistory;

    /** This is a required property for querying later */
    nextEntryInHistory.lead = leadId;

    // this len condition maybe unnecessary if mongoose itself handles
    // this condition being an array since that is what we defined in
    // the schema, also try
    // const prevHistory = get(oldLead, `history${[len - 1]}`, null);
    const [prevHistory] = await this.leadHistoryModel
      .find({})
      .sort({ $natural: -1 })
      .limit(1);

    if (!reassignmentInfo) {
      // assign to logged in user and notes will be lead was created by
      nextEntryInHistory.notes = `Lead has been assigned to ${loggedInUserEmail} by default`;
      nextEntryInHistory.newUser = loggedInUserEmail;
    }


    if(lead.documentLinks?.length>0) {
      nextEntryInHistory.documentLinks = lead.documentLinks;
    }

    if (reassignmentInfo && prevHistory?.newUser !== reassignmentInfo.newUser) {
      nextEntryInHistory.notes = `Lead has been assigned to ${reassignmentInfo.newUser} by ${loggedInUserEmail}`;
      nextEntryInHistory.oldUser = prevHistory.newUser;
      nextEntryInHistory.newUser = reassignmentInfo.newUser;
    }

    if (lead.leadStatus !== oldLead.leadStatus) {
      nextEntryInHistory.notes = `${oldLead.leadStatus} to ${lead.leadStatus} by ${loggedInUserEmail}`;
    }

    nextEntryInHistory.geoLocation = geoLocation;
    if (requestedInformation && Object.keys(requestedInformation).length > 0) {
      /** @Todo this filter should be removed, checkbox is currently returning empty object, please remove that */
      nextEntryInHistory["requestedInformation"] = requestedInformation.filter(
        (ri) => Object.keys(ri).length > 0
      );
    }
    /** @Todo add dialed phone number */
    nextEntryInHistory.prospectName = `${lead.firstName} ${lead.lastName}`;
    nextEntryInHistory.leadStatus = lead.leadStatus;
    nextEntryInHistory.followUp = lead.followUp?.toString();
    nextEntryInHistory.organization = organization;
    nextEntryInHistory.campaign = campaignId;
    lead.nextAction && (nextEntryInHistory.nextAction = lead.nextAction);

    /** Do not update contact, there will be a separate api for adding contact information */
    let { contact, ...filteredObj } = obj;

    // if reassignment is required, change that in the lead
    if (get(reassignmentInfo, "newUser")) {
      obj.email = reassignmentInfo.newUser;
    }


    await this.ruleService.applyRules(campaignId, oldLead, lead, nextEntryInHistory);
    const result = await this.leadModel.findOneAndUpdate(
      { _id: leadId, organization },
      { $set: filteredObj }
    );

    await this.leadHistoryModel.create({...nextEntryInHistory, ...callRecord});
    if (!values(emailForm).every(isEmpty)) {
      const { subject, attachments, content } = emailForm;
      this.sendEmailToLead({
        content,
        subject,
        attachments,
        email: lead.email,
      });
    }
    return result;
  }


  /** @Todo replace getSubordinates in user.service with this one, checked: true is missing over there, and this should be
   * moved into a shared service
   */
  async getSubordinates(email: string, roleType: string, organization: string) {
    if (roleType === "frontline") {
      return [email];
    }
    const fq: any = [
      { $match: { organization, email: email, verified: true } },
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
    return [email, ...result[0].subordinates];
  }

  async parseLeadFiles(
    files: S3UploadedFiles[],
    ccnfg: IConfig[],
    campaignName: string,
    organization: string,
    uploader: string,
    uploaderId: string,
    pushtoken: string,
    campaignId: string,
    uniqueAttr: Partial<Campaign>
  ) {
    files.forEach(async (file) => {
      const jsonRes = await parseExcel(file.Location, ccnfg);
      await this.saveLeadsFromExcel(
        jsonRes,
        campaignName,
        file.Key,
        organization,
        uploader,
        uploaderId,
        pushtoken,
        campaignId,
        uniqueAttr
      );
    });
  }

  async saveLeadsFromExcel(
    leads: any[],
    campaignName: string,
    originalFileName: string,
    organization: string,
    uploader: string,
    uploaderId: string,
    pushtoken,
    campaignId: string,
    uniqueAttr: Partial<Campaign>
  ) {
    const created = [];
    const updated = [];
    const error = [];

    const leadColumns = await this.campaignConfigModel
      .find({
        name: campaignName,
        organization,
      })
      .lean()
      .exec();

    // const leadMappings = keyBy(leadColumns, "internalField");
    for (const lead of leads) {
      // let contact = [];
      // Object.keys(lead).forEach((key) => {
      //   if (leadMappings[key].group === "contact") {
      //     contact.push({
      //       label: leadMappings[key].readableField,
      //       value: lead[key],
      //       // automating it for now even though it should come from the lead file, this logic should strictly be placed in the ui
      //       // use a library like lodash to find if the value is an email or not
      //       category: isString(lead[key]) && lead[key]?.indexOf("@") > 0 ? 'email': 'mobile'
      //     });
      //     delete lead[key];
      //   }
      // });

      let findUniqueLeadQuery = {};
      uniqueAttr.uniqueCols.forEach(col=>{
        findUniqueLeadQuery[col] = lead[col];
      })


      /** @Todo to improve update speed use an index of campaignId, @Note mongoose already understands that campaignId is ObjectId
       * no need to convert it;; organization filter is not required since campaignId is mongoose id which is going to be unique
       * throughout
       */
      findUniqueLeadQuery["campaignId"] = campaignId;

      const { lastErrorObject, value } = await this.leadModel
        .findOneAndUpdate(
          findUniqueLeadQuery,
          // { ...lead, campaign: campaignName, contact, organization, uploader, campaignId },
          { ...lead, campaign: campaignName, organization, uploader, campaignId },
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

    // writeFile(wb, originalFileName + "_system");
    const wbOut = write(wb, {
      bookType: "xlsx",
      type: "buffer",
    });

    const fileName = `result-${originalFileName}`;
    const result = await this.s3UploadService.uploadFileBuffer(fileName, wbOut);


    await this.adminActionModel.create({
        userid: uploaderId,
        organization,
        actionType: "lead",
        filePath: result.Location,
        savedOn: "s3",
        fileType: "lead",
        campaign: campaignId
    })

    await this.pushNotificationService.sendPushNotification(pushtoken, {
      notification: {
        title: "File Upload Complete",
        icon: `https://cdn3.vectorstock.com/i/1000x1000/94/72/cute-black-cat-icon-vector-13499472.jpg`,
        body: `please visit ${result.Location} for the result`,
        tag: "some random tag",
        badge: `https://e7.pngegg.com/pngimages/564/873/png-clipart-computer-icons-education-molecule-icon-structure-area.png`,
      },
    });
    return result;
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

  async fetchNextLead({
    campaignId,
    filters,
    email,
    organization,
    typeDict,
    roleType
  }: {
    campaignId: string;
    filters: Map<string, string>;
    email: string;
    organization: string;
    typeDict: Map<string, any>;
    roleType: string
  }) {
    // Null value removal
    Object.keys(filters).forEach((k) => {
      if (!filters[k]) {
        delete filters[k];
      }
    });

    const campaign = await this.campaignModel
      .findOne({ _id: campaignId, organization })
      .lean()
      .exec();

    if (!campaign || !campaign.browsableCols || !campaign.editableCols) {
      throw new UnprocessableEntityException();
    }

    const singleLeadAgg = this.leadModel.aggregate();
    singleLeadAgg.match({ campaignId: campaign._id });


    /** @Todo Try to cache this call */
    const subordinateEmails = await this.getSubordinates(
      email,
      roleType,
      organization
    );


    singleLeadAgg.match({
      $or: [
        { email: { $in: [...subordinateEmails, email] } },
        { email: { $exists: false } },
      ],
    })

    Object.keys(filters).forEach((key) => {
      switch (typeDict[key].type) {
        case "string":
        case "select":
        case "tel":
          /** @Todo coalesce all match queries in order of best match to worst match */
          const expr = new RegExp(filters[key]);
          singleLeadAgg.match({ [key]: { $regex: expr, $options: "i" } });
          break;
        case "date":
          const dateInput = filters[key];
          if (dateInput.length === 2) {
            const startDate = new Date(dateInput[0]);
            const endDate = new Date(dateInput[1]);

            singleLeadAgg.match({
              [key]: {
                $gte: startDate,
                $lt: endDate,
              },
            });
          } else if (dateInput.length === 1) {
            singleLeadAgg.match({
              [key]: {
                $eq: new Date(dateInput[0]),
              },
            });
          }
          break;
      }
    });

    // oldest lead first from match queries
    singleLeadAgg.sort({ _id: 1 });
    singleLeadAgg.limit(1);

    let projection = {};

    campaign.browsableCols.forEach((c) => {
      projection[c] = 1;
    });

    /** @Todo Quick fix for sending contact ionformation to frontend, to put some effort into this if required */
    projection["contact"] = 1;
    projection["nextAction"] = 1;

    // other information that should always show up, one is history

    singleLeadAgg.project(projection);
    const lead = (await singleLeadAgg.exec())[0];

    /** Only call lead history if there is a lead with the applied filters */
    let leadHistory = [];
    if (lead) {
      leadHistory = await this.leadHistoryModel
        .find({ lead: lead._id })
        .limit(5);
    }
    return { lead, leadHistory };
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

  async getTransactions(
      organization: string, 
      email: string, 
      roleType: string, 
      payload: GetTransactionDto, 
      isStreamable: boolean
    ): Promise<{ response: Partial<LeadHistory>[], total: number }> {
    // get email ids of users after him
    let conditionalQueries = {};
    let subordinateEmails = await this.getSubordinates(email, roleType, organization);

    // if the user only wants to see results for some subordinates this will filter it out
    if(payload.filters?.handler?.length > 0) {
      subordinateEmails = intersection(payload.filters.handler, subordinateEmails, [email])
    };

    if(payload.filters?.prospectName) {
      /** @Todo to be filled later, we have firstname, lastname, fullName, these should be combined in a text index for search */ 
      const expr = new RegExp(payload.filters.prospectName);
      conditionalQueries['prospectName'] = { $regex: expr, $options: "i" }
    }

    if(payload.filters?.campaign) {
      conditionalQueries["campaign"] = payload.filters.campaign;
    }

    if(payload.filters?.startDate) {
      conditionalQueries["createdAt"] = {};
      conditionalQueries["createdAt"]["$gte"] = new Date(payload.filters.startDate);
    }

    if(payload.filters?.endDate) {
      conditionalQueries["createdAt"]["$lte"] = new Date(payload.filters.endDate);
    }

    const sortOrder = payload.pagination.sortOrder === "ASC" ? 1 : -1;

    const query = {organization, newUser: {$in: subordinateEmails}, ...conditionalQueries};
    const result = this.leadHistoryModel
      .find(query)
      .sort({ [payload.pagination.sortBy]: sortOrder });


    let count = 0;
    if(!isStreamable) {
      result.limit(payload.pagination.perPage).skip(payload.pagination.page * payload.pagination.perPage);
      count = await this.leadHistoryModel.countDocuments(query);
    }

    const response = await result.lean().exec();
    return { response, total: count };
  }
  // date will always be greater than today
  async getFollowUps({
    interval,
    organization,
    email,
    campaignName,
    limit,
    skip,
    page,
  }) {
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

    leadAgg.facet({
      metadata: [{ $count: "total" }, { $addFields: { page: Number(page) } }],
      data: [{ $skip: skip }, { $limit: limit }], // add projection here wish you re-shape the docs
    });

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

    return this.alarmModel.aggregate(fq).exec();
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

    userAgg.project({ amount: "$amount", leadStatus: "$leadStatus" });

    userAgg.group({ _id: "$leadStatus", amount: { $sum: "$amount" } });

    return userAgg.exec();
  }

  async sendEmailToLead({ content, subject, attachments, email }) {
    let transporter = createTransport({
      service: "Mailgun",
      auth: {
        user: config.mail.user,
        pass: config.mail.pass,
      },
    });

    let mailOptions: SendMailOptions = {
      from: '"Company" <' + config.mail.user + ">",
      to: ["shanur.cse.nitap@gmail.com"],
      subject: subject,
      text: content,
      replyTo: {
        name: "shanur",
        address: "mnsh0203@gmail.com",
      },
      attachments: attachments?.map((a) => {
        return {
          filename: a.fileName,
          path: a.filePath,
        };
      }),
    };

    var sended = await new Promise<boolean>(async function (resolve, reject) {
      return await transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.log("Message sent: %s", error);
          return reject(false);
        }
        console.log("Message sent: %s", info.messageId);
        resolve(true);
      });
    });
    return sended;
  }

  async addContact(contact: UpdateContactDto, leadId: string) {
    return this.leadModel.findByIdAndUpdate(leadId, {
      $push: { contact },
    });
  }
}
