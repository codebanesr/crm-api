import parseExcel from "../../util/parseExcel";
import XLSX from "xlsx";
import Lead from '../../models/lead';
import { IConfig } from "../../util/renameJson";
interface iFile {

    "fieldname": string,
    "originalname": string,
    "encoding": string,
    "mimetype": string,
    "destination": string,
    "path": string,
    "size": number
}
export const parseLeadFiles = async (files: any, ccnfg: IConfig[], campaignName: string) => {
    files.forEach(async (file: iFile) => {
        const jsonRes = parseExcel(file.path, ccnfg);
        saveLeads(jsonRes, campaignName, file.originalname);
    })
};



/** Findone and update implementation */
const saveLeads = async (leads: any[], campaignName: string, originalFileName: string) => {
    const created = [];
    const updated = [];
    const error = [];

    for (const l of leads) {
        const { lastErrorObject, value } = await Lead.findOneAndUpdate(
            { externalId: l.externalId },
            { ...l, campaign: campaignName },
            { new: true, upsert: true, rawResult: true }
        ).lean().exec();
        if (lastErrorObject.updatedExisting === true) {
            updated.push(value);
        } else if (lastErrorObject.upserted) {
            created.push(value);
        } else {
            error.push(value);
        }
    }

    // createExcel files and update them to aws and then store the urls in database with AdminActions
    const created_ws = XLSX.utils.json_to_sheet(created);
    const updated_ws = XLSX.utils.json_to_sheet(updated);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, updated_ws, "tickets updated");
    XLSX.utils.book_append_sheet(wb, created_ws, "tickets created");

    XLSX.writeFile(wb, originalFileName + "_system");
    console.log("created: ", created.length, "updated: ", updated.length, "error:", error.length);
};