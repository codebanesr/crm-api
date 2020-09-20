"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xlsx_1 = require("xlsx");
const renameJson_1 = require("./renameJson");
const parseExcel = (filePath, renameDict) => {
    const workbook = xlsx_1.readFile(filePath);
    const sheet_name_list = workbook.SheetNames;
    const data = [];
    sheet_name_list.forEach(function (y) {
        const worksheet = workbook.Sheets[y];
        const headers = {};
        let z;
        for (z in worksheet) {
            if (z[0] === "!")
                continue;
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
            if (row == 1 && value) {
                headers[col] = value;
                continue;
            }
            if (!data[row])
                data[row] = {};
            data[row][headers[col]] = value;
        }
        data.shift();
        data.shift();
        renameJson_1.renameJson(data, renameDict);
    });
    return data;
};
exports.default = parseExcel;
//# sourceMappingURL=parseExcel.js.map