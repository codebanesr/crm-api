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



export const saveEmailAttachments = ( req: AuthReq, res: Response) => {
    const files = req.files;
    return res.status(200).send({files});
};
export const reassignLead = async(req: AuthReq, res: Response) => {
    const { oldUserEmail, newUserEmail, lead } = req.body;

    try {
        const assigned = oldUserEmail ? "reassigned" : "assigned";
        let note = "";
        if(oldUserEmail) {
            note = `Lead ${assigned} from ${oldUserEmail} to ${newUserEmail} by ${req.user.email}`;
        } else{
            note = `Lead ${assigned} to ${newUserEmail} by ${req.user.email}`;
        }
        const history = {
            oldUser: oldUserEmail,
            newUser: newUserEmail,
            note
        };

        const result = await Lead.updateOne({externalId: lead.externalId}, {email: newUserEmail, $push: {history: history}}).lean().exec();
        return res.status(200).json(result);
    }catch(e) {
        return res.status(400).send({error: e.message});
    }
};


// filePath: String,
// fileName: String
export const createEmailTemplate = async (req: AuthReq, res: Response) => {
    const { email } = req.user;
    const { content, subject, campaigns, attachments } = req.body;


    let acceptAttachmentFormat = attachments.map((a: any)=>{
        let {originalname: fileName, path: filePath, ...others} = a
        return {
            fileName,
            filePath,
            ...others
        }
    })
    const emailTemplate = new EmailTemplate({
        campaigns: campaigns,
        email: email,
        content: content,
        subject: subject,
        attachments: acceptAttachmentFormat
    });


    const result = await emailTemplate.save();


    return res.status(200).json(result);
};


export const getAllEmailTemplates = async(req: AuthReq, res: Response) => { 
    const { limit, skip, offset } = req.query;
    const result = await EmailTemplate.find({});


    return result;
};

export const getLeadHistoryById = async(req: Request, res: Response) => {
    const {externalId} = req.params;
    const history = await Lead.findOne({externalId: externalId}, {history: 1, externalId});

    return res.status(200).send(history);
};

export const getLeadReassignmentHistory = async(req: Request, res: Response) => {
    const leadId = req.query.email;
    try {
        const result = await Lead.aggregate([
            {$match: {_id: leadId}},
            {$project: {history: 1}},
            {$unwind: "$history"},
            {$sort: {time: 1}},
            {$limit: 5},
            {$replaceRoot: { newRoot: "$history" }}
        ]);
    
        res.status(200).send(result);
    }catch(e) {
        res.status(400).send({error: e.message});
    }
};


export const getBasicOverview = async(req: Request, res: Response) => {
    const result = await Lead.aggregate([
        {$group: { _id: "$leadStatus", count:{$sum:1}}}
    ]);

    const total = await Lead.count({});
    return res.status(200).send({result, total});
};




export const findAll = async (req: Request & { user: UserDocument }, res: Response, next: NextFunction) => {
    const { page, perPage, sortBy = "createdAt", showCols, searchTerm, filters } = req.body;
    const limit = Number(perPage);
    const skip = Number((+page - 1) * limit);

    const { assigned, archived, lead, ticket } = filters;
    const matchQ = { $and: [] } as any;
    if (assigned) {
        const subordinateEmails = await userController.getSubordinates(req.user);
        matchQ.$and.push({ email: { $in: [...subordinateEmails, req.user.email] } });
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
        flds = (await CampaignConfig.find({ name: "core", checked: true }, { internalField: 1 }).lean().exec()).map((config: any) => config.internalField);
    }

    const projectQ = {} as any;
    flds.forEach((fld: string) => {
        projectQ[fld] = { "$ifNull": [`$${fld}`, "---"] };
    });

    projectQ._id = 0;

    const fq = [
        { $match: matchQ },
        {
            $project: projectQ
        },
        { $sort: { [sortBy]: 1 } },
        { $skip: skip },
        { $limit: limit }
    ];
    console.log(JSON.stringify(fq));
    const leads = await Lead.aggregate(fq);
    res.status(200).json(leads);
};


export const getAllLeadColumns = async(req: Request, res: Response, next: NextFunction) => {
    const { campaignType = "core" } = req.query;
    const matchQ: any = {name: campaignType};

    const paths = await CampaignConfig.aggregate([
        { $match: matchQ }
    ]);

    return res.status(200).send({paths: paths});
};


export const insertOne = async(req: any, res: Response, next: NextFunction) => {
    const { body } = req;
    // assiging it to the user that created the lead by default
    body.email = req.user.email;

    const lead = new Lead(body);
    const result = await lead.save();

    // move to worker
    await createAlarm(
        {
            module: "LEAD",
            tag: "LEAD_CREATE",
            severity: "LOW",
            userEmail: req.user.email, 
            moduleId: result._id,
        }
    );
    return res.status(201).json(result);
};

export const findOneById = async(req: Request, res: Response, next: NextFunction) => {
    const id = req.params.leadId;
    const lead = await Lead.findById(id).lean().exec();

    res.status(200).send(lead);
};


export const patch = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.productId;
    const updateOps: {[index: string]: any} = {};
    for (const ops of req.body) {
        const propName = ops.propName;
        updateOps[propName] = ops.value;
    }
    Lead.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Lead updated",
                request: {
                    type: "GET",
                    url: "http://localhost:3000/lead/" + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

export const deleteOne = async(req: any, res: Response, next: NextFunction) => {
    const id = req.params.leadId;
    const result = await Lead.remove({ _id: id }).lean().exec();
    await createAlarm(
        {
            module: "LEAD",
            tag: "LEAD_CREATE",
            severity: "LOW",
            userEmail: req.user.email, 
            moduleId: id,
        }
    );


    res.status(200).json(result);
};



// { 
//     filename: 'text3.txt',
//     path: '/path/to/file.txt'
// }
export const sendBulkEmails = (req: Request, res: Response, next: NextFunction) => {
    let { emails, subject, text, attachments } = req.body;
    emails = isArray(emails) ?  emails: [emails];
    emails = emails.join(",");
    try {
        sendEmail(emails, subject, text, attachments);
        res.status(200).send({success: true});
    }catch(e) {
        res.status(400).send({error: e.message});
        console.log(e);
    }
};