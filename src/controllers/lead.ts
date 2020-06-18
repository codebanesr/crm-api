import { NextFunction, Request, Response } from "express";
import Lead from "../models/lead";
import { createAlarm } from "./alarm";
import CampaignConfig from "../models/CampaignConfig";

export const findAll = async(req: Request, res: Response, next: NextFunction) => {
    const { page, perPage, sortBy='createdAt', showCols } = req.body;
    const limit = Number(perPage);
    const skip = Number((+page-1)*limit);


    let flds; 
    if(showCols) {
        flds = showCols;
    }else{
        flds = (await CampaignConfig.find({name: "core"}, {internalField: 1, _id: 0})).map((config: any)=>config.internalField)
    }
    
    let projectQ = { } as any;
    flds.forEach((fld: string)=>{
        projectQ[fld] = { "$ifNull" : [`$${fld}`, "---"]}
    });

    projectQ._id = 0;

    const fq = [
        {$match: {}},
        {
            $project: projectQ
        },
        {$sort: {[sortBy]: 1}},
        {$skip: skip},
        {$limit: limit}
    ];

    const leads = await Lead.aggregate(fq);
    console.log(fq);
    res.status(200).json(leads);
};


export const getAllLeadColumns = async(req: Request, res: Response, next: NextFunction) => {
    const { campaignType } = req.query;
    let matchQ = {} as any;
    if(!campaignType) {
        matchQ = {name: "core"}
    }
    const paths = await CampaignConfig.aggregate([
        { $match: matchQ }
    ]);

    return res.status(200).send({paths: paths});
}


export const insertOne = async(req: any, res: Response, next: NextFunction) => {
    const { body } = req;
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
    const result = await Lead.remove({ _id: id }).lean().exec()
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