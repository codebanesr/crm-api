import { IConfig } from "./renameJson";
declare const parseExcel: (filePath: string, renameDict?: IConfig[]) => Promise<any>;
export default parseExcel;
