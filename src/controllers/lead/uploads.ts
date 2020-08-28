import CampaignConfig from "../../models/CampaignConfig";
import { Response } from 'express';
import { AuthReq } from "../../interface/authorizedReq";
import { IConfig } from "../../util/renameJson";
import { parseLeadFiles } from "./helper";

// {
//   campaignName: 'typeb',
//   comment: 'some info about the campaign, should reach multer',
//   type: 'Lead Generation',
//   interval: [ '2020-07-24T13:31:02.621Z', '2020-07-04T13:26:07.078Z' ]

// }
export const uploadMultipleLeadFiles = async (req: AuthReq, res: Response) => {
    const files = req.files;
  
    let { campaignName } = req.body;
  
  
    const ccnfg: any = await CampaignConfig.find({ name: campaignName }, { readableField: 1, internalField: 1, _id: 0 }).lean().exec();
    if (!ccnfg) {
      return res.status(400).json({ error: `Campaign with name ${campaignName} not found, create a campaign before uploading leads for that campaign` })
    }
  
    const result = await parseLeadFiles(files, ccnfg as IConfig[], campaignName);
    // parse data here
    res.status(200).send({files, result});
  }
  
  