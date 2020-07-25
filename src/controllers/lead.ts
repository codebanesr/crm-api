import { NextFunction, Request, Response } from "express";
import Lead from "../models/lead";
import EmailTemplate from "../models/EmailTemplate";
import { createAlarm } from "./alarm";
import CampaignConfig from "../models/CampaignConfig";
import * as userController from "../controllers/user";
import { UserDocument } from "../models/User";
import { sendEmail } from "../util/sendMail";
import { isArray } from "lodash";
import { AuthReq } from "../interface/authorizedReq";
import parseExcel from "../util/parseExcel";
import { IConfig } from "../util/renameJson";
import XLSX from "xlsx";
import CallLog from "../models/CallLog";
import * as fs from "fs";
import GeoLocation from "../models/GeoLocation";
import mongoose from "mongoose";

export const saveEmailAttachments = (req: AuthReq, res: Response) => {
  const files = req.files;
  return res.status(200).send({ files });
};
export const reassignLead = async (req: AuthReq, res: Response) => {
  const { oldUserEmail, newUserEmail, lead } = req.body;

  try {
    const assigned = oldUserEmail ? "reassigned" : "assigned";
    let note = "";
    if (oldUserEmail) {
      note = `Lead ${assigned} from ${oldUserEmail} to ${newUserEmail} by ${req.user.email}`;
    } else {
      note = `Lead ${assigned} to ${newUserEmail} by ${req.user.email}`;
    }
    const history = {
      oldUser: oldUserEmail,
      newUser: newUserEmail,
      note,
    };

    const result = await Lead.updateOne(
      { externalId: lead.externalId },
      { email: newUserEmail, $push: { history: history } }
    )
      .lean()
      .exec();
    return res.status(200).json(result);
  } catch (e) {
    return res.status(400).send({ error: e.message });
  }
};

// filePath: String,
// fileName: String
export const createEmailTemplate = async (req: AuthReq, res: Response) => {
  const { email } = req.user;
  const { content, subject, campaign, attachments } = req.body;

  let acceptableAttachmentFormat = attachments.map((a: any) => {
    let { originalname: fileName, path: filePath, ...others } = a;
    return {
      fileName,
      filePath,
      ...others,
    };
  });
  const emailTemplate = new EmailTemplate({
    campaign: campaign,
    email: email,
    content: content,
    subject: subject,
    attachments: acceptableAttachmentFormat,
  });

  const result = await emailTemplate.save();

  return res.status(200).json(result);
};

// const result = await Campaign.find({type: {$regex: "^"+hint, $options:"I"}}).limit(20);
export const getAllEmailTemplates = async (req: AuthReq, res: Response) => {
  const { limit = 10, skip = 0, campaign } = req.query;

  const query = EmailTemplate.aggregate();
  const result = await query
    .match({ campaign: {$regex: `^${campaign}`, $options: "I"} })
    .sort("type")
    .limit(limit)
    .skip(skip)
    .exec();

  return res.status(200).send(result);
};

export const getLeadHistoryById = async (req: Request, res: Response) => {
  const { externalId } = req.params;
  const history = await Lead.findOne(
    { externalId: externalId },
    { history: 1, externalId }
  );

  return res.status(200).send(history);
};

export const getLeadReassignmentHistory = async (
  req: Request,
  res: Response
) => {
  const leadId = req.query.email;
  try {
    const result = await Lead.aggregate([
      { $match: { _id: leadId } },
      { $project: { history: 1 } },
      { $unwind: "$history" },
      { $sort: { time: 1 } },
      { $limit: 5 },
      { $replaceRoot: { newRoot: "$history" } },
    ]);

    res.status(200).send(result);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

export const getBasicOverview = async (req: Request, res: Response) => {
  const result = await Lead.aggregate([
    { $group: { _id: "$leadStatus", count: { $sum: 1 } } },
  ]);

  const total = await Lead.count({});
  return res.status(200).send({ result, total });
};

export const findAll = async (
  req: Request & { user: UserDocument },
  res: Response,
  next: NextFunction
) => {
  const {
    page,
    perPage,
    sortBy = "createdAt",
    showCols,
    searchTerm,
    filters,
  } = req.body;
  const limit = Number(perPage);
  const skip = Number((+page - 1) * limit);

  const { assigned, archived, lead, ticket } = filters;
  const matchQ = { $and: [] } as any;
  if (assigned) {
    const subordinateEmails = await userController.getSubordinates(req.user);
    matchQ.$and.push({
      email: { $in: [...subordinateEmails, req.user.email] },
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
      await CampaignConfig.find(
        { name: "core", checked: true },
        { internalField: 1 }
      )
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
  const leads = await Lead.aggregate(fq);
  res.status(200).json(leads);
};

export const getAllLeadColumns = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { campaignType = "core" } = req.query;
  const matchQ: any = { name: campaignType };

  const paths = await CampaignConfig.aggregate([{ $match: matchQ }]);

  return res.status(200).send({ paths: paths });
};

export const insertOne = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;
  // assiging it to the user that created the lead by default
  body.email = req.user.email;

  const lead = new Lead(body);
  const result = await lead.save();

  // move to worker
  await createAlarm({
    module: "LEAD",
    tag: "LEAD_CREATE",
    severity: "LOW",
    userEmail: req.user.email,
    moduleId: result._id,
  });
  return res.status(201).json(result);
};

export const findOneById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const leadId = req.params.leadId;
  const lead = await Lead.findOne({externalId: leadId}).lean().exec();

  res.status(200).send(lead);
};

export const patch = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.productId;
  const updateOps: { [index: string]: any } = {};
  for (const ops of req.body) {
    const propName = ops.propName;
    updateOps[propName] = ops.value;
  }
  Lead.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Lead updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/lead/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

export const deleteOne = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.leadId;
  const result = await Lead.remove({ _id: id }).lean().exec();
  await createAlarm({
    module: "LEAD",
    tag: "LEAD_CREATE",
    severity: "LOW",
    userEmail: req.user.email,
    moduleId: id,
  });

  res.status(200).json(result);
};

// {
//     filename: 'text3.txt',
//     path: '/path/to/file.txt'
// }
export const sendBulkEmails = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { emails, subject, text, attachments } = req.body;
  emails = isArray(emails) ? emails : [emails];
  emails = emails.join(",");
  try {
    sendEmail(emails, subject, text, attachments);
    res.status(200).send({ success: true });
  } catch (e) {
    res.status(400).send({ error: e.message });
    console.log(e);
  }
};


export const suggestLeads = async(req: AuthReq, res: Response, next: NextFunction) => {
  const { leadId, limit = 10 } = req.params;
  const query = Lead.aggregate();

  query.match({ externalId: { $regex: `^${leadId}` }, email: req.user.email });
  query.project('externalId -_id');
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
  return res.status(200).json(result);
}


// {
//   campaignName: 'typeb',
//   comment: 'some info about the campaign, should reach multer',
//   type: 'Lead Generation',
//   interval: [ '2020-07-24T13:31:02.621Z', '2020-07-04T13:26:07.078Z' ]
// }
export const uploadMultipleLeadFiles = async (req: AuthReq, res: Response) => {
  const files = req.files;

  let { campaignInfo } = req.body;
  campaignInfo = JSON.parse(campaignInfo);


  const ccnfg = await CampaignConfig.find({name: campaignInfo.campaignName}, {readableField: 1, internalField: 1, _id: 0}).lean().exec() as IConfig[];
  if (!ccnfg) {
    return res.status(400).json({ error: `Campaign with name ${campaignInfo.campaignName} not found, create a campaign before uploading leads for that campaign` })
  }

  const result = await parseLeadFiles(files, ccnfg, campaignInfo.campaignName);
  // parse data here
  res.status(200).send(files);
}




interface iFile {

    "fieldname": string,
    "originalname": string,
    "encoding": string,
    "mimetype": string,
    "destination": string,
    "path": string,
    "size": number

  
}

export const syncPhoneCalls = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { callLogs } = req.body;
    fs.writeFileSync("callLogs.json", JSON.stringify(callLogs));
    const result = await CallLog.insertMany(callLogs);
    return res.status(200).send(result);
  } catch (e) {
    return res.status(500).send({error: e.message});
  }
};

export const addGeolocation = async (req: AuthReq, res: Response, next: NextFunction) => {
  const { lat, lng } = req.body;
  const { id } = req.user;
  var geoObj = new GeoLocation({
    userid: mongoose.Types.ObjectId(id),
    location: {
      lat,
      lng
    }
  });
  const result = await geoObj.save();

  return res.status(200).json(result);
};

export const updateLead = async (req: Request, res: Response, next: NextFunction) => {
  const { externalId } = req.params;
  let { lead } = req.body;

  // lead = lead.filter((l: any) => {
  //   return !!l;
  // })

  let obj = {} as any;
  Object.keys(lead).forEach(key => {
    if (!!lead[key]) {
      obj[key] = lead[key];
    }
  })

  const result = await Lead.findOneAndUpdate({ externalId: externalId }, { $set: obj });
  return res.status(200).send(result);
}

export const parseLeadFiles = async(files: any, ccnfg: IConfig[], campaignName: string) => {
  files.forEach(async(file: iFile) => {
    const jsonRes = parseExcel(file.path, ccnfg);
    saveLeads(jsonRes, campaignName, file.originalname);
  })
};


/** Findone and update implementation */
const saveLeads = async(leads: any[], campaignName: string, originalFileName: string) => {
  const created = [];
  const updated = [];
  const error = [];
  
  for(const l of leads) {
      const { lastErrorObject, value } = await Lead.findOneAndUpdate(
          { externalId: l.externalId }, 
          {...l, campaign: campaignName}, 
          { new: true, upsert: true, rawResult: true }
      ).lean().exec();
      if(lastErrorObject.updatedExisting === true) {
          updated.push(value);
      }else if(lastErrorObject.upserted) {
          created.push(value);
      }else{
          error.push(value);
      }
  }

  // createExcel files and update them to aws and then store the urls in database with AdminActions
  const created_ws = XLSX.utils.json_to_sheet(created);
  const updated_ws = XLSX.utils.json_to_sheet(updated);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, updated_ws, "tickets updated");
  XLSX.utils.book_append_sheet(wb, created_ws, "tickets created");

  XLSX.writeFile(wb, originalFileName + "_system");
  console.log("created: ",created.length, "updated: ",updated.length, "error:", error.length);
};