/* eslint-disable @typescript-eslint/camelcase */
import { readFile, read } from "xlsx";
import { renameJson, IConfig } from "./renameJson";
import axios from "axios";
/**
 *
 * @param filePath String
 * @param renameDict Dictionary of (<oldName>, <newName>);; where excels header names are renamed from oldName, newName
 * the excel sheet should have <oldName> in the header
 */
const parseExcel = async (filePath: string, renameDict?: IConfig[]) => {
  let workbook;
  if (filePath.indexOf("amazonaws") > 0) {
    const result = await axios({
      method: "GET",
      url: filePath,
      responseType: "arraybuffer",
    });
    workbook = read(result.data, { type: "buffer" });
  } else {
    workbook = readFile(filePath);
  }

  const sheet_name_list = workbook.SheetNames;
  const data: any = [];
  sheet_name_list.forEach(function (y: any) {
    const worksheet = workbook.Sheets[y];
    const headers: any = {};
    let z: any;
    for (z in worksheet) {
      if (z[0] === "!") continue;
      //parse out the column, row, and value
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

      //store header names
      if (row == 1 && value) {
        headers[col] = value;
        continue;
      }

      if (!data[row]) data[row] = {};
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
