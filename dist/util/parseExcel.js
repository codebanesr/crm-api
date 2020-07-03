"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/camelcase */
const xlsx_1 = __importDefault(require("xlsx"));
const renameJson_1 = require("./renameJson");
/**
 *
 * @param filePath String
 * @param renameDict Dictionary of (<oldName>, <newName>);; where excels header names are renamed from oldName, newName
 * the excel sheet should have <oldName> in the header
 */
const parseExcel = (filePath, renameDict) => {
    const workbook = xlsx_1.default.readFile(filePath);
    const sheet_name_list = workbook.SheetNames;
    const data = [];
    sheet_name_list.forEach(function (y) {
        const worksheet = workbook.Sheets[y];
        const headers = {};
        let z;
        for (z in worksheet) {
            if (z[0] === "!")
                continue;
            //parse out the column, row, and value
            let tt = 0;
            for (let i = 0; i < z.length; i++) {
                if (!isNaN(z[i])) {
                    tt = i;
                    break;
                }
            }
            ;
            const col = z.substring(0, tt);
            const row = parseInt(z.substring(tt));
            const value = worksheet[z].v;
            //store header names
            if (row == 1 && value) {
                headers[col] = value;
                continue;
            }
            if (!data[row])
                data[row] = {};
            data[row][headers[col]] = value;
        }
        //drop those first two rows which are empty
        data.shift();
        data.shift();
        renameJson_1.renameJson(data, renameDict);
    });
    return data;
};
exports.default = parseExcel;
//# sourceMappingURL=parseExcel.js.map