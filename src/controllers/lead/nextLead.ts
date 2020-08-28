import { Request, Response, NextFunction } from 'express';
import { AuthReq } from '../../interface/authorizedReq';
import Campaign from '../../models/Campaign';
import Lead from '../../models/lead';
export const fetchNextLead = async (req: AuthReq, res: Response, next: NextFunction) => {
    const { campaignId, leadStatus } = req.params;
 
    // cache this call
    const campaign: any = await Campaign.findOne({ _id: campaignId }).lean().exec();
    const result = await Lead.findOne(
        {
            campaign: campaign.campaignName,
            leadStatus,
            $or: [
                { email: req.user.email },
                {
                    email: { $exists: false }
                }
            ]
        }).sort({ _id: -1 }).lean().exec();
    return res.status(200).send({result});
}