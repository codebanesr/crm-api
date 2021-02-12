import { AgentService } from "./agent.service";
import { Response } from "express";
import { User } from "../user/interfaces/user.interface";
import { BatteryStatusDto } from "./schemas/battery-status.dto";
import { AddLocationDto } from "./dto/add-location.dto";
import { GetUsersLocationsDto } from "./dto/get-user-locations.dto";
export declare class AgentController {
    private agentService;
    constructor(agentService: AgentService);
    getUsersPerformance(user: User, skip: number, fileType: string, sortBy: string, me: boolean, campaign: string): Promise<Pick<import("../user/interfaces/admin-actions.interface").AdminAction, "_id" | "organization" | "campaign" | "userid" | "actionType" | "fileType" | "savedOn" | "filePath">[]>;
    downloadFile(res: Response, location: string): Promise<void>;
    batteryStatus(batLvl: BatteryStatusDto, user: User): Promise<import("./interface/visit-track.interface").VisitTrack>;
    getVisitTrack(userLocationDto: GetUsersLocationsDto, user: User): Promise<import("./interface/visit-track.interface").VisitTrack[]>;
    addVisitTrack(user: User, payload: AddLocationDto): Promise<import("./interface/visit-track.interface").VisitTrack>;
}
