import { RuleDto } from './dto/rule.dto';
import { Rules } from './rules.interface';
export declare class RulesService {
    private readonly ruleModel;
    getRuleById(id: string): Promise<Pick<Rules, "_id" | "url" | "campaign" | "disposition" | "trigger" | "action" | "changeHandler" | "daysOverdue" | "fromDisposition" | "newDisposition" | "newHandler" | "numberOfAttempts" | "toDisposition">>;
    getAllRules(limit: number, offset: number): Promise<Rules[]>;
    addRule(rule: RuleDto): Promise<Rules>;
}
