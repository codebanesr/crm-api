import { get, keyBy } from "lodash";
/** Takes two arguments json array and rename dictionary array 
 * [{name: "Name"}, "age": "Age"] where the key is the name as mentioned in the excel sheet and value is how 
 * you want to store it in the database
 */
export const renameJson = (excelJson: any, cnfg: IConfig[]) => {
    const config = keyBy(cnfg, "readableField");
    if(!config) {
        return excelJson;
    }
    let row: any;
    for(row of excelJson) {
        for(let readableField in row) {
            let internalField = get(config, `[${readableField}].internalField`, readableField);
            if(readableField === internalField) continue;
            
            row[internalField as string] = row[readableField];
            delete row[readableField];
        }
    }

    return excelJson;
};


export interface IConfig {
    "internalField" : string,
    "readableField" : string,
}