import { Document } from "mongoose";
export interface Disposition extends Document {
    creator: string;
    campaign: string;
    options: DispositionTree[];
    organization: string;
}
export interface DispositionTree {
    title: string;
    key: string;
    expanded: boolean;
    children: DispositionTree[];
}
