import { NextFunction, Request, Response } from "express";
import Campaign from "../../models/Campaign";
import mongoose from 'mongoose';
import CampaignConfig from "../../models/CampaignConfig";

export const getAllLeadColumns = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { campaignType = "core" }: any = req.query;
  if (campaignType !== "core") {
    const campaign: any = await Campaign.findOne({ _id: mongoose.Types.ObjectId(campaignType) }).lean().exec();
    campaignType = campaign.campaignName;
  }
  const matchQ: any = { name: campaignType };

  const paths = await CampaignConfig.aggregate([{ $match: matchQ }]);

  return res.status(200).send({ paths: paths });
};
