/** https://www.youtube.com/watch?v=srPXMt1Q0nY&t=477s */
import { NextFunction, Request, Response } from "express";
import Campaign from "../../models/Campaign";
import parseExcel from "../../util/parseExcel";
import Disposition from "../../models/Disposition";
import { AuthReq } from "../../interface/authorizedReq";
import XLSX from "xlsx";
import CampaignConfig from "../../models/CampaignConfig";
export const findAll = async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, perPage = 20, filters={}, sortBy = "handler" } = req.body;

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
        { $skip: skip },
        { $limit: limit }
    ];

    if(fq[0]["$match"]["$and"].length === 0) {
        delete fq[0]["$match"]["$and"];
    }
    console.log(JSON.stringify(fq));
    const result = await Campaign.aggregate(fq);
    res.status(200).json(result);
};

export const findOneById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.campaignId;
        const result = await Campaign.findById(id);
    
        return res.status(200).json(result);
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ error: e.message });
    }
};


export const patch = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.campaignId;
    const updateOps: { [index: string]: any } = {};
    for (const ops of req.body) {
        const propName = ops.propName;
        updateOps[propName] = ops.value;
    }
    Campaign.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Customer updated",
                request: {
                    type: "GET",
                    url: "http://localhost:3000/product/" + id
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

export const deleteOne = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.campaignId;
    Campaign.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Customer deleted",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/product",
                    body: { name: "String", price: "Number" }
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



export const getHandlerEmailHints = async(req: Request, res: Response, next: NextFunction) => {
    const limit = 15;
    const { partialEmail } = req.query;
    const result = await Campaign.aggregate([
        {
            $match: {
                handler: {$regex: `^${partialEmail}`}
            }
        },{
            $project: {handler: 1, _id:0}
        },
        { $limit: limit }
    ]);

    return res.status(200).send(result.map(r=>r.handler));
};

export const getCampaignTypes = async(req: Request, res: Response, next: NextFunction) => {
    const { hint } = req.query;
    const result = await Campaign.find({type: {$regex: "^"+hint, $options:"I"}}).limit(20);

    return res.status(200).send(result);
};

/** @Todo this has to be thought better */
const defaultDisposition = async (res: Response) => {
    try {
        let disposition = await Disposition.findOne({
            campaign: "5ee225b99580594afd8561dd"
        });
        if (!disposition) {
            return res.status(500).json({ error: "Core campaign schema not found, verify that creator id exists in user schema and campaignId in campaign schema... This is for core config. Also remember that during populate mongoose will look for these ids" });
        }
    
        return res.status(200).json(disposition);
    } catch (e) {
        return res.status(500).json({e: e.message})
    }
}

export const getDispositionForCampaign = async (req: AuthReq, res: Response, next: NextFunction) => {
    const { campaignId } = req.params;
    if (campaignId == "core") {
        defaultDisposition(res);
    } else {
        let disposition = await Disposition.findOne({ campaign: campaignId });

        return res.status(200).json(disposition);   
    }
}



export const uploadConfig = async(req: Request, res: Response, next: NextFunction) => {
    const path = req.file.path;
    const excelObject = parseExcel(path);
};



export const createCampaignAndDisposition = async(req: AuthReq, res: Response) => {
    const { id: userid } = req.user;
    let { dispositionData, campaignInfo } = req.body;

    dispositionData = JSON.parse(dispositionData);
    campaignInfo = JSON.parse(campaignInfo);

    const ccJSON = parseExcel(req.file.path);

    const campaign = await Campaign.findOneAndUpdate(
        { campaignName: campaignInfo.campaignName },
        { ...campaignInfo, createdBy: userid },
        { new: true, upsert: true, rawResult: true }
    )

    const campaignResult = await saveCampaignSchema(ccJSON, { schemaName: campaignInfo.campaignName });

    let disposition = new Disposition({ options: dispositionData, campaign: campaign.value.id });
    disposition = await disposition.save();

    return res.status(200).json({
        campaign: campaign.value,
        disposition,
        campaignResult
    })

}




export const saveCampaignSchema = async(ccJSON: any[], others: any) => {
    const created = [];
    const updated = [];
    const error = [];
    
    for(const cc of ccJSON) {
        const { lastErrorObject, value } = await CampaignConfig.findOneAndUpdate(
            { name: others.schemaName, internalField: cc.internalField }, 
            cc, 
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

    XLSX.writeFile(wb, "sheetjs.xlsx");
    console.log("created: ",created.length, "updated: ",updated.length, "error:", error.length);
};
