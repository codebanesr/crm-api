import { ChangeStateDto } from './dto/changeState.dto';
import { RuleDto } from './dto/rule.dto';
import { RulesService } from './rules.service';
export declare class RulesController {
    private readonly rulesService;
    constructor(rulesService: RulesService);
    getAllRules(limit: number, offset: number, campaignId: string): Promise<Pick<import("./rules.interface").Rules, "_id" | "url" | "campaign" | "isActive" | "action" | "changeHandler" | "daysOverdue" | "disposition" | "fromDisposition" | "newDisposition" | "newHandler" | "numberOfAttempts" | "toDisposition" | "trigger">[]>;
    getRuleById(ruleId: string): Promise<Pick<import("./rules.interface").Rules, "_id" | "url" | "campaign" | "isActive" | "action" | "changeHandler" | "daysOverdue" | "disposition" | "fromDisposition" | "newDisposition" | "newHandler" | "numberOfAttempts" | "toDisposition" | "trigger">>;
    addRule(ruleDto: RuleDto): Promise<import("./rules.interface").Rules>;
    changeRuleState(changeStateDto: ChangeStateDto): Promise<Pick<import("./rules.interface").Rules, "_id" | "url" | "campaign" | "isActive" | "action" | "changeHandler" | "daysOverdue" | "disposition" | "fromDisposition" | "newDisposition" | "newHandler" | "numberOfAttempts" | "toDisposition" | "trigger">>;
}
