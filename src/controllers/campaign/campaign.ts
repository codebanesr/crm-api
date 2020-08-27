/** https://www.youtube.com/watch?v=srPXMt1Q0nY&t=477s */
import { NextFunction, Request, Response } from "express";
import Campaign from "../../models/Campaign";
import parseExcel from "../../util/parseExcel";
import Disposition from "../../models/Disposition";
import { AuthReq } from "../../interface/authorizedReq";
import { defaultDisposition } from "./helper";
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
