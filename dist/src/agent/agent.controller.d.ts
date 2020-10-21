import { AgentService } from "./agent.service";
import { Response } from "express";
import { User } from "../user/interfaces/user.interface";
export declare class AgentController {
    private agentService;
    constructor(agentService: AgentService);
    getUsersPerformance(user: User, skip: number, fileType: string, sortBy: string, me: boolean): Promise<any[]>;
    downloadFile(res: Response, location: string): void;
}
