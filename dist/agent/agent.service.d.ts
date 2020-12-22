import { Model } from "mongoose";
import { Response } from "express";
import { AdminAction } from "../user/interfaces/admin-actions.interface";
import { User } from "../user/interfaces/user.interface";
import { BatteryStatusDto } from "./schemas/battery-status.dto";
import { VisitTrack } from "./interface/visit-track.interface";
import { AddLocationDto } from "./dto/add-location.dto";
export declare class AgentService {
    private readonly adminActionModel;
    private readonly visitTrackModel;
    private readonly userModel;
    constructor(adminActionModel: Model<AdminAction>, visitTrackModel: Model<VisitTrack>, userModel: Model<User>);
    listActions(activeUserId: string, organization: string, skip: any, fileType: any, sortBy: string, me: any, campaign: string): Promise<Pick<AdminAction, "_id" | "organization" | "campaign" | "userid" | "actionType" | "filePath" | "savedOn" | "fileType">[]>;
    downloadFile(location: string, res: Response): Promise<void>;
    updateBatteryStatus(userId: string, batLvlDto: BatteryStatusDto): Promise<VisitTrack>;
    addVisitTrack(userId: string, payload: AddLocationDto): Promise<VisitTrack>;
    getVisitTrack(id: string, roleType: string, organization: string, userIds: string[]): Promise<VisitTrack[]>;
    getSubordinates(id: string, roleType: string): Promise<any[]>;
}
