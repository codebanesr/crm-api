"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameJson = void 0;
const lodash_1 = require("lodash");
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