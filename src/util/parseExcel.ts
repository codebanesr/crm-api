/* eslint-disable @typescript-eslint/camelcase */
import XLSX from "xlsx";
import { renameJson } from "./renameJson";


/**
 * 
 * @param filePath String
 * @param renameDict Dictionary of (<oldName>, <newName>);; where excels header names are renamed from oldName, newName
 * the excel sheet should have <oldName> in the header 
 */
const parseExcel = (filePath: string, renameDict?: any) => {
    const workbook = XLSX.readFile(filePath);
    const sheet_name_list = workbook.SheetNames;
    const data: any = [];
    sheet_name_list.forEach(function(y: any) {
        const worksheet = workbook.Sheets[y];
        const headers: any = {};
        let z: any;
        for(z in worksheet) {
            if(z[0] === "!") continue;
            //parse out the column, row, and value
            let tt = 0;
            for (let i = 0; i < z.length; i++) {
                if (!isNaN(z[i])) {
                    tt = i;
                    break;
                }
            };
            const col = z.substring(0,tt);
            const row = parseInt(z.substring(tt));
            const value = worksheet[z].v;

            //store header names
            if(row == 1 && value) {
                headers[col] = value;
                continue;
            }

            if(!data[row]) data[row]={};
            data[row][headers[col]] = value;
        }
        //drop those first two rows which are empty
        data.shift();
        data.shift();

        renameJson(data, renameDict);
    });
    return data;
};

export default parseExcel;