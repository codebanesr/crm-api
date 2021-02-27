import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LeadHistory } from "./interfaces/lead-history.interface";
import { Lead } from "./interfaces/lead.interface";


@Injectable()
export class LeadAnalyticService {
    @InjectModel("Lead")
    private readonly leadModel: Model<Lead>;


    @InjectModel("LeadHistory")
    private readonly leadHistoryModel: Model<LeadHistory>;

    
    async getGraphData(organization: string, userList: string[]) {
        const barAgg = this.leadModel.aggregate(); 
        barAgg.match({organization, email: {$in: userList}});
        barAgg.group({_id: {type: "$leadStatus"}, value: {$sum: 1} });
        barAgg.project({type: "$_id.type", value: "$value", _id: 0});

        const pieAgg = this.leadHistoryModel.aggregate();
        pieAgg.match({organization});
        pieAgg.group( {_id: {type: "$leadStatus"}, value: {$sum: 1} })
        pieAgg.project({type: "$_id.type", value: "$value", _id: 0});

        const stackBarData = this.leadHistoryModel.aggregate();
        stackBarData.match({organization, email: {$in: userList}});
        stackBarData.project({ "month": { "$month": "$createdAt" }, "year": {"$year": "$createdAt"}, "callStatus": "$callStatus" });
        stackBarData.group( { "_id": { "month": "$month", "year": "$year", "callStatus": "$callStatus" }, "NOC": { "$sum": 1 } });
        stackBarData.project({"month": {"$concat": [ "$year", " - ", "$month"] }, "NOC": "$_id.NOC", "type": "$_id.callStatus", });
    
        const [pieData, barData, stackData] = await Promise.all([pieAgg, barAgg, stackBarData]);
    
        return { pieData, barData, stackData };
    }

    async getLeadStatusDataForLineGraph (email: string, organization: string, year: string) {

        // @Todo organization filter is required
        return this.leadHistoryModel.aggregate([
            { $match: { organization } },
            {
                $project: { "year":{"$year":"$createdAt"}, "month":{"$month":"$createdAt"}, leadStatus: "$leadStatus"}
            },
            { $match: {"year": +year } },
            {
                 $group : { 
                     _id : { 
                         month : "$month", 
                         year : "$year",
                         leadStatus: "$leadStatus"
                     },
                     total : {"$sum" : 1},
                 }
             },
             {
                 $addFields: {
                     month: {
                         $let: {
                             vars: {
                                 monthsInString: [, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December']
                             },
                             in: {
                                 $arrayElemAt: ['$$monthsInString', '$_id.month']
                             }
                         }
                     }
                 }
             },{
                $project: {
                    total: "$total",
                    month: "$month",
                    leadStatus: "$_id.leadStatus"
                }
             }
         ]).exec();
    }
}
