import { AgentService } from "./agent.service";
import { Response } from "express";
import { User } from "../user/interfaces/user.interface";
export declare class AgentController {
    private agentService;
    constructor(agentService: AgentService);
    getUsersPerformance(user: User, skip: number, fileType: string, sortBy: string, me: boolean, campaign: string): Promise<Pick<import("../user/interfaces/admin-actions.interface").AdminAction, "_id" | "organization" | "campaign" | "userid" | "actionType" | "filePath" | "savedOn" | "fileType">[]>;
    downloadFile(res: Response, location: string): void;
}
