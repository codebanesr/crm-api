import { User } from "../user/interfaces/user.interface";
import { DashboardService } from "./dashboard.service";
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getLeadStatusByOrganization(user: User, body: any): Promise<any>;
    getLeadStatusByDepartment(user: User, body: any): Promise<any>;
    getLeadInfoByMonth(user: User, body: any): Promise<any>;
}
