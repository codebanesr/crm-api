import { ChangeStateDto } from './dto/changeState.dto';
import { RuleDto } from './dto/rule.dto';
import { RulesService } from './rules.service';
export declare class RulesController {
    private readonly rulesService;
    constructor(rulesService: RulesService);
    getAllRules(limit: number, offset: number, campaignId: string): Promise<Pick<import("./rules.interface").Rules, "_id" | "url" | "trigger" | "campaign" | "isActive" | "action" | "changeHandler" | "daysOverdue" | "disposition" | "fromDisposition" | "newDisposition" | "newHandler" | "numberOfAttempts" | "toDisposition">[]>;
    getRuleById(ruleId: string): Promise<Pick<import("./rules.interface").Rules, "_id" | "url" | "trigger" | "campaign" | "isActive" | "action" | "changeHandler" | "daysOverdue" | "disposition" | "fromDisposition" | "newDisposition" | "newHandler" | "numberOfAttempts" | "toDisposition">>;
    addRule(ruleDto: RuleDto): Promise<import("./rules.interface").Rules>;
    changeRuleState(changeStateDto: ChangeStateDto): Promise<Pick<import("./rules.interface").Rules, "_id" | "url" | "trigger" | "campaign" | "isActive" | "action" | "changeHandler" | "daysOverdue" | "disposition" | "fromDisposition" | "newDisposition" | "newHandler" | "numberOfAttempts" | "toDisposition">>;
}
