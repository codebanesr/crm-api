import {
  ConflictException,
  Injectable,
  Logger,
  PreconditionFailedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Document, Model } from "mongoose";
import { Lead } from "./interfaces/lead.interface";
import { get, intersection, isArray, isEmpty, values } from "lodash";
import { Types } from "mongoose";
import { User } from "../user/interfaces/user.interface";
import { Alarm } from "./interfaces/alarm";
import { NotificationService } from "../utils/notification.service";
import { EmailTemplate } from "./interfaces/email-template.interface";
import { CampaignConfig } from "./interfaces/campaign-config.interface";
import { GeoLocation } from "./interfaces/geo-location.interface";
import { UpdateLeadDto } from "./dto/update-lead.dto";
import { Campaign } from "../campaign/interfaces/campaign.interface";
import { FiltersDto } from "./dto/find-all.dto";
import { AttachmentDto } from "./dto/create-email-template.dto";
import { S3UploadedFiles } from "./dto/generic.dto";
import { UpdateContactDto } from "./dto/update-contact.dto";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { GetTransactionDto } from "./dto/get-transaction.dto";
import { RulesService } from "../rules/rules.service";
import { UserService } from "../user/user.service";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import config from '../config';
import { RoleType } from "../shared/role-type.enum";
import { FetchNextLeadDto, TypeOfLead } from "./dto/fetch-next-lead.dto";
import { AdminAction } from "../agent/interface/admin-actions.interface";
import { LeadHistory } from "./interfaces/lead-history.interface";
import moment = require("moment");
@Injectable()
export class LeadService {
  constructor(
    @InjectModel("Lead")
    private readonly leadModel: Model<Lead>,

    @InjectModel("AdminAction")
    private readonly adminActionModel: Model<AdminAction>,

    @InjectModel("CampaignConfig")
    private readonly campaignConfigModel: Model<CampaignConfig>,

    @InjectModel("Campaign")
    private readonly campaignModel: Model<Campaign>,

    @InjectModel("EmailTemplate")
    private readonly emailTemplateModel: Model<EmailTemplate>,

    @InjectModel("LeadHistory")
    private readonly leadHistoryModel: Model<LeadHistory>,

    @InjectModel("GeoLocation")
    private readonly geoLocationModel: Model<GeoLocation>,

    @InjectModel("Alarm")
    private readonly alarmModel: Model<Alarm>,


    @InjectQueue('leadQ') 
    private leadUploadQueue: Queue,

    private readonly ruleService: RulesService,

    private userService: UserService,

    private notificationService: NotificationService,
  ) {}


  logger = new Logger("leadService", true);
  saveEmailAttachments(files) {
    return files;
  }


  /** @Todo these logs should also be recorded */
  async reassignBulkLead(user: User, newUserEmail: string, leadIds: string[]) {
    return this.leadModel.updateMany({_id: {$in: leadIds}}, {email: newUserEmail});
  }


  async reassignLead(
    activeUserEmail: string,
    oldUserEmail: string,
    newUserEmail: string,
    lead: Partial<Lead>
  ) {
    const assigned = oldUserEmail ? "reassigned" : "assigned";
    let notes = "";
    if (oldUserEmail) {
      notes = `Lead ${assigned} from ${oldUserEmail} to ${newUserEmail} by ${activeUserEmail}`;
    } else {
      notes = `Lead ${assigned} to ${newUserEmail} by ${activeUserEmail}`;
    }

    const history: Pick<LeadHistory, 'oldUser'|'newUser'|'notes'|'lead'|'campaign'|'campaignName'|'organization' | 'geoLocation'> = {
      oldUser: oldUserEmail,
      newUser: newUserEmail,
      notes,
      lead: lead._id,
      campaign: lead.campaignId,
      campaignName: lead.campaign, 
      organization: lead.organization,
      geoLocation: {
        coordinates: null
      }
    };

    const result = await this.leadModel
      .updateOne(
        { _id: lead._id },
        { email: newUserEmail }
      )
      .lean()
      .exec();


    /** @Todo check for better types */
    const leadHistory = await this.leadHistoryModel.create(history as any);
    return { result, leadHistory };
  }


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
    const { assigned, selectedCampaign, dateRange, leadStatusKeys, showArchived, showClosed, handlers,...otherFilters } = filters;
    const [startDate, endDate] = dateRange || [];

    const leadAgg = this.leadModel.aggregate();
    // match with text is only allowed as the first pipeline stage
    if (searchTerm) {
      leadAgg.match({ $text: { $search: searchTerm } });
    }

    // this will check if the value is non existent, false or null, all of which are possible depending on 
    // whether the field has been touched or not
    const matchQuery = { organization, archived: {$ne: true} };

    if(showArchived) {
      matchQuery.archived["$eq"] = true;
    }

    if(showClosed) {
      matchQuery['nextAction'] = '__closed__'
    }

    if(handlers) {
      matchQuery["email"] = {$in: handlers};
    }

    if(campaignId!=='all') {
      matchQuery['campaignId'] = Types.ObjectId(campaignId);
    }else {
      /**  a lead cannot be present without a campaignId, if a campaignId was passed use that campaign id to filter leads. nahi to a lead 
      must atleast have a campaignId, use a worker process to delete leads that dont belong to a campaign and log those leads that were
      deleted. @Todo remove this check when everything works fine, we should not have this situation in the first place */
      matchQuery['campaignId'] = { $exists: true }
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
      const subordinateEmails = await this.userService.getSubordinates(
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
    flds.push('campaignId'); // this is used for browsing through different campaigns when all campaigns is selected

    flds.forEach((fld: string) => {
      // projectQ[fld] = { $ifNull: [`$${fld}`, "---"] };
      projectQ[fld] = 1;
    });

    projectQ.transactionCount = 1;
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

  async getLeadColumns(campaignId, removeFields) {
    const project = {};
    const paths = await this.campaignConfigModel.find({campaignId, internalField: {$nin: removeFields}});
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


  /** next action should never be fetched, it should not be carried forward to the next transaction */
  async findOneById(leadId: string, email: string, roleType: string) {
    /**  */
    const lead = await this.leadModel
      .findById(leadId)
      .lean()
      .exec();


    if(!lead.email && roleType!== RoleType.frontline) {
      await this.leadModel.findOneAndUpdate({_id: leadId}, {email}, {timestamps: false}).lean().exec();
      lead.email = email;
    }


    let leadHistory = []
    if(lead) {
      leadHistory = await this.leadHistoryModel
      .find({ lead: lead._id}, { nextAction: 0 })
      .limit(5)
      .lean()
      .exec();
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
      campaignId,
      campaign: campaignName,
      organization,
      contact,
      isPristine: true // setting pristine flag to true for newly created lead
    }).catch((e)=>{
        if(e.code === 11000) {
          throw new ConflictException("Mobile number must be unique");
        }
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
      this.notificationService.sendMail({ subject, text, attachments, to: sepEmails });
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
    Logger.debug("Sending file to worker for processing");
    const result = await this.leadUploadQueue.add({ files, campaignName, uploader, organization, userId, pushtoken, campaignId });
    Logger.debug(result);

    return result;
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
    handlerEmail,
    handlerName,
    emailForm,
    requestedInformation,
    campaignId,
    callRecord,
    reassignToUser,
  }: UpdateLeadDto & {
    leadId: string;
    organization: string;
    handlerEmail: string;
    handlerName: string;
  }) {
    let obj = {} as Partial<Lead>;
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

    if (!reassignToUser) {
      // assign to logged in user and notes will be lead was created by
      // we are not changing old user and new user, call duration calculation will always be done on 
      // old user, agar agent call karke reassign kiya to bhi call duration uske me hi count hoga.
      nextEntryInHistory.oldUser = handlerEmail;
      nextEntryInHistory.newUser = handlerEmail;
    }


    if(lead.documentLinks?.length>0) {
      nextEntryInHistory.documentLinks = lead.documentLinks;
    }

    if (reassignToUser && prevHistory?.newUser !== reassignToUser) {
      nextEntryInHistory.notes = `Lead has been assigned to ${reassignToUser} by ${handlerName}`;
      nextEntryInHistory.oldUser = prevHistory.newUser;
      nextEntryInHistory.newUser = reassignToUser;
    }

    if (lead.leadStatus !== oldLead.leadStatus) {
      nextEntryInHistory.notes = `${oldLead.leadStatus} to ${lead.leadStatus} by ${handlerName}`;
    }

    if(lead.notes) {
      nextEntryInHistory.notes = (nextEntryInHistory.notes || '') + `\n User Note: ${lead.notes}`;
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
    
    nextEntryInHistory.nextAction = lead.nextAction;

    /** Do not update contact, there will be a separate api for adding contact information, we dont want to set the 
     * value of transaction count it has to be incremented
     */
    let { contact, transactionCount, ...filteredObj } = obj;

    // if reassignment is required, change that in the lead
    if (reassignToUser) {
      obj.email = reassignToUser;
    }


    await this.ruleService.applyRules(campaignId, oldLead, lead, nextEntryInHistory);

    filteredObj.isPristine = false;

    let result = {};

    try {
      if(!lead.nextAction) {
        filteredObj.nextAction = '__closed__';
      }

      result = await this.leadModel.findOneAndUpdate(
        { _id: leadId, organization },
        { $inc: { transactionCount: 1 }, $set: filteredObj },
        {new: true} //set it to false for performance boost
      ).lean().exec();
    }catch(e) {
      if(e.code === 11000) {
        throw new ConflictException("Mobile number must be unique");
      }
    }


    await this.leadHistoryModel.create({...nextEntryInHistory, ...callRecord });
    if (!values(emailForm).every(isEmpty)) {
      const { subject, attachments, content, overwriteEmail } = emailForm;
      this.sendEmailToLead({
        content,
        subject,
        attachments,
        email: overwriteEmail || lead.email,
      });
    }
    return result;
  }

  async sendEmailToLead({ content, subject, attachments, email }) {
    this.notificationService.sendMail({
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
    });
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

  async findInjectableLeads(organization: string, email: string, campaignId: string, projection) {
    const fifteenMinsAgo = moment().subtract(15, 'minutes').toDate();
    const now = moment().toDate();
    const lead = await this.leadModel
      .findOne({ campaignId, organization, email, followUp: {$lte: now, $gte: fifteenMinsAgo} })
      .lean()
      .exec();

    this.logger.debug({ injectableLead: lead });
    return lead;
  }

  /** @Todo here we are setting nextAction to null before sending it to the frontend, but this happens also in getLead api
   * this should be remembered and fetching the lead should be done in the same function to prevent this in the future
   */
  async fetchNextLead({
    campaignId,
    filters,
    email,
    organization,
    typeDict,
    roleType,
    nonKeyFilters
  }: FetchNextLeadDto & {
    campaignId: string;
    email: string;
    organization: string;
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


    // this should always be fetched ...
    let projection = {
      documentLinks: 1
    };

    campaign.browsableCols.forEach((c) => {
      projection[c] = 1;
    });

    /** @Todo Quick fix for sending contact ionformation to frontend, to put some effort into this if required */
    projection["contact"] = 1;
    // next action should not be carried forward
    // projection["nextAction"] = 1;
    projection["email"] = 1;


    const injectableLead = await this.findInjectableLeads(organization, email, campaign._id, projection);
    if(injectableLead) {
      this.logger.log("Injectable lead found, returning it");
      const leadHistory = await this.leadHistoryModel
      .find({ lead: injectableLead._id })
      .limit(5);
      return {lead: injectableLead, leadHistory, isInjectableLead: true};
    }

    const singleLeadAgg = this.leadModel.aggregate();
    singleLeadAgg.match({ campaignId: campaign._id });


    /** @Todo Try to cache this call */
    const subordinateEmails = await this.userService.getSubordinates(
      email,
      roleType,
      organization
    );


    singleLeadAgg.match({
      $or: [
        { email: { $in: [...subordinateEmails, email] } },
        { email: { $exists: false } },
        { archived: false }
      ],
    })


    if(nonKeyFilters) {
      var todayStart = new Date();
      todayStart.setHours(0);
      todayStart.setMinutes(0);
      todayStart.setSeconds(1);
  
      var todayEnd = new Date();
      todayEnd.setHours(23);
      todayEnd.setMinutes(59);
      todayEnd.setSeconds(59);


      switch(nonKeyFilters.typeOfLead) {
        case TypeOfLead.followUp: {
          singleLeadAgg.match({
            followUp: {
              $gte: new Date(todayStart),
              $lte: new Date(todayEnd),
            },
          });
          break;
        }

        case TypeOfLead.fresh: {
          singleLeadAgg.match({isPristine: true})
          break;
        }

        case TypeOfLead.freshAndFollowUp: {
          // nothing required here
          break;
        }
      }
    }

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
    singleLeadAgg.sort({ updatedAt: 1 });
    singleLeadAgg.limit(1);


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


    // before sending the lead, assign this lead to the user who is going to view it; do not change the timestamp
    // this operation is performed by the system internally.
    // If this lead was not already assigned to a user, it should be assigned to the user who is going to 
    // see this lead.
    if(!lead.email && roleType === RoleType.frontline) {
      lead.email = email;
      await this.leadModel.findOneAndUpdate({_id: lead._id}, {email}, {timestamps: false});
      this.logger.debug(`Assigned lead ${lead._id} to ${email}`);
    }


    lead.nextAction = null;
    return { lead, leadHistory, isInjectableLead: false };
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
    let subordinateEmails = await this.userService.getSubordinates(email, roleType, organization);

    // if the user only wants to see results for some subordinates this will filter it out
    if(payload.filters?.handler?.length > 0) {
      subordinateEmails = intersection(payload.filters?.handler, subordinateEmails)
    };

    if(payload.filters?.leadId) {
      conditionalQueries['lead'] = payload.filters.leadId;
    }

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
      result.limit(payload.pagination.perPage).skip((payload.pagination.page-1) * payload.pagination.perPage);
      count = await this.leadHistoryModel.countDocuments(query);
    }

    const response = await result.lean().exec();
    return { response, total: count };
  }
  // date will always be greater than today, 
  // problem is similar to get upcoming birthday from mongodb
  async getFollowUps({
    interval,
    organization,
    email,
    campaignId,
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

    if (campaignId) {
      leadAgg.match({ campaignId: Types.ObjectId(campaignId) });
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


  async checkPrecondition(user: User, subordinateEmail: string) {

    const subordinates = await this.userService.getSubordinates(user.email, user.roleType, user.organization);

    if (!subordinates.indexOf(subordinateEmail) && user.roleType !== "admin") {
      throw new PreconditionFailedException(
        null,
        "You do not manage the user whose followups you want to see"
      );
    }
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

  async addContact(contact: UpdateContactDto, leadId: string) {
    return this.leadModel.findByIdAndUpdate(leadId, {
      $push: { contact },
    });
  }

  async archiveLead(leadId: string) {
    return this.leadModel.findOneAndUpdate({_id: leadId}, {$set: {archived: true}});
  }

  async archiveLeads(leadIds: string[]) {
    return this.leadModel.updateMany({_id: {$in: leadIds}}, {$set: {archived: true}});
  }

  async unarchiveLeads(leadIds: string[]) {
    return this.leadModel.updateMany({_id: {$in: leadIds}}, {$set: { archived: false }});
  }

  async transferLeads(leadIds: string[], toCampaignId: string) {
    const {campaignName, _id} = await this.campaignModel.findOne({_id: toCampaignId}, {campaignName: 1}).lean().exec();
    return this.leadModel.updateMany({_id: {$in: leadIds}}, {$set: {campaignId: _id, campaign: campaignName}}).lean().exec();
  }


  async openClosedLeads(leadIds: string[]) {
    return this.leadModel.updateMany({_id: {$in: leadIds}}, {$set: {nextAction: '__open__'}});
  }
}
