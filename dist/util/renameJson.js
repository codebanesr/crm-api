"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
/** Takes two arguments json array and rename dictionary array
 * [{name: "Name"}, "age": "Age"] where the key is the name as mentioned in the excel sheet and value is how
 * you want to store it in the database
 */
exports.renameJson = (excelJson, cnfg) => {
    const config = lodash_1.keyBy(cnfg, "readableField");
    if (!config) {
        return excelJson;
    }
    let row;
    for (row of excelJson) {
        for (let readableField in row) {
            let internalField = lodash_1.get(config, `[${readableField}].internalField`, readableField);
            if (readableField === internalField)
                continue;
            row[internalField] = row[readableField];
            delete row[readableField];
        }
    }
    return excelJson;
};
//# sourceMappingURL=renameJson.js.map