import { Model } from "mongoose";
import { Response } from "express";
import { AdminAction } from "../agent/interface/admin-actions.interface";
import { User } from "../user/interfaces/user.interface";
import { BatteryStatusDto } from "./schemas/battery-status.dto";
import { VisitTrack } from "./interface/visit-track.interface";
import { AddLocationDto } from "./dto/add-location.dto";
import { GetUsersLocationsDto } from "./dto/get-user-locations.dto";
import { PinoLogger } from "nestjs-pino";
export declare class AgentService {
    private readonly adminActionModel;
    private readonly visitTrackModel;
    private readonly userModel;
    private logger;
    constructor(adminActionModel: Model<AdminAction>, visitTrackModel: Model<VisitTrack>, userModel: Model<User>, logger: PinoLogger);
    listActions(activeUserId: string, organization: string, skip: any, fileType: any, sortBy: string, me: any, campaign: string): Promise<any>;
    downloadFile(location: string, res: Response): Promise<void>;
    updateBatteryStatus(userId: string, batLvlDto: BatteryStatusDto): Promise<VisitTrack>;
    addVisitTrack(userId: string, payload: AddLocationDto): Promise<VisitTrack>;
    getVisitTrack(id: string, roleType: string, organization: string, userLocationDto: GetUsersLocationsDto): Promise<Pick<VisitTrack, "_id" | "userId" | "batLvl" | "isGpsEnabled" | "locations">[]>;
    getSubordinates(id: string, roleType: string): Promise<any[]>;
}
