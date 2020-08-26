import parseExcel from "../../util/parseExcel";
import Campaign from "../../models/Campaign";
import { AuthReq } from "../../interface/authorizedReq";
import Disposition from "../../models/Disposition";
import { saveCampaignSchema } from "./helper";
import { Response } from 'express';
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
