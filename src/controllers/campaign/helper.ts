import Disposition from "../../models/Disposition";
import XLSX from "xlsx";
import CampaignConfig from "../../models/CampaignConfig";
import { Response } from 'express';
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



/** @Todo this has to be thought better */
export const defaultDisposition = async (res: Response) => {
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
