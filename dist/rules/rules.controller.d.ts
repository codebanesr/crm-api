import { RuleDto } from './dto/rule.dto';
import { RulesService } from './rules.service';
export declare class RulesController {
    private readonly rulesService;
    constructor(rulesService: RulesService);
    getAllRules(limit: number, offset: number): Promise<import("./rules.interface").Rules[]>;
    getRuleById(ruleId: string): Promise<Pick<import("./rules.interface").Rules, "_id" | "url" | "campaign" | "disposition" | "trigger" | "action" | "changeHandler" | "daysOverdue" | "fromDisposition" | "newDisposition" | "newHandler" | "numberOfAttempts" | "toDisposition">>;
    addRule(ruleDto: RuleDto): Promise<import("./rules.interface").Rules>;
}
