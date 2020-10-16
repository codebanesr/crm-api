import { Model } from "mongoose";
import { Response } from "express";
import { AdminAction } from "../user/interfaces/admin-actions.interface";
export declare class AgentService {
    private readonly adminActionModel;
    constructor(adminActionModel: Model<AdminAction>);
    listActions(activeUserId: string, organization: string, skip: any, fileType: any, sortBy: string, me: any): Promise<any[]>;
    downloadFile(location: string, res: Response): Promise<void>;
}
