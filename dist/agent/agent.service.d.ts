import { Model } from "mongoose";
import { Response } from "express";
import { AdminAction } from "../user/interfaces/admin-actions.interface";
import { User } from "../user/interfaces/user.interface";
import { BatteryStatusDto } from "./schemas/battery-status.dto";
export declare class AgentService {
    private readonly adminActionModel;
    private readonly userModel;
    constructor(adminActionModel: Model<AdminAction>, userModel: Model<User>);
    listActions(activeUserId: string, organization: string, skip: any, fileType: any, sortBy: string, me: any, campaign: string): Promise<Pick<AdminAction, "_id" | "organization" | "campaign" | "userid" | "actionType" | "filePath" | "savedOn" | "fileType">[]>;
    downloadFile(location: string, res: Response): Promise<void>;
    updateBatteryStatus(userId: string, batLvl: BatteryStatusDto): Promise<User>;
}
