/** Takes two arguments json array and rename dictionary array 
 * [{name: "Name"}, "age": "Age"] where the key is the name as mentioned in the excel sheet and value is how 
 * you want to store it in the database
 */
export const renameJson = (excelJson: any, renameDict: any) => {
    if(!renameDict) {
        return excelJson;
    }
    let row: any;
    for(row of excelJson) {
        let entry: any;
        for (entry of Object.entries(renameDict)) {
            const [oldKey, newKey] = entry;
            row[newKey] = row[oldKey];
            delete row[oldKey];
        }
    }

    return excelJson;
};