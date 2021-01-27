import { Document } from "mongoose";
export interface ResellerOrganization extends Document {
    orgName: string;
    orgId: string;
    resellerName: string;
    resellerId: string;
    credit: number;
}
