"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const xlsx_1 = require("xlsx");
const renameJson_1 = require("./renameJson");
const axios_1 = require("axios");
const parseExcel = (filePath, renameDict) => __awaiter(void 0, void 0, void 0, function* () {
    let workbook;
    if (filePath.indexOf("amazonaws") > 0) {
        const result = yield axios_1.default({
            method: "GET",
            url: filePath,
            responseType: "arraybuffer",
        });
        workbook = xlsx_1.read(result.data, { type: "buffer" });
    }
    else {
        workbook = xlsx_1.readFile(filePath);
    }
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
});
exports.default = parseExcel;
//# sourceMappingURL=parseExcel.js.map