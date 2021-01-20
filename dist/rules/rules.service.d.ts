import { Lead } from 'src/lead/dto/update-lead.dto';
import { LeadHistory } from 'src/lead/interfaces/lead-history.interface';
import { ChangeStateDto } from './dto/changeState.dto';
import { RuleDto } from './dto/rule.dto';
import { Rules } from './rules.interface';
export declare class RulesService {
    private readonly ruleModel;
    getRuleById(id: string): Promise<Pick<Rules, "_id" | "url" | "campaign" | "disposition" | "trigger" | "isActive" | "action" | "changeHandler" | "daysOverdue" | "fromDisposition" | "newDisposition" | "newHandler" | "numberOfAttempts" | "toDisposition">>;
    getAllRules(campaignId: string, limit: number, offset: number): Promise<Pick<Rules, "_id" | "url" | "campaign" | "disposition" | "trigger" | "isActive" | "action" | "changeHandler" | "daysOverdue" | "fromDisposition" | "newDisposition" | "newHandler" | "numberOfAttempts" | "toDisposition">[]>;
    addRule(rule: RuleDto): Promise<Rules>;
    changeState(changeStateDto: ChangeStateDto): Promise<Pick<Rules, "_id" | "url" | "campaign" | "disposition" | "trigger" | "isActive" | "action" | "changeHandler" | "daysOverdue" | "fromDisposition" | "newDisposition" | "newHandler" | "numberOfAttempts" | "toDisposition">>;
    applyRules(campaignId: string, lead: Lead, history: LeadHistory): Promise<{
        lead: Lead;
        history: LeadHistory;
    }>;
    callApiAction(lead: Lead, url: string): Promise<void>;
}
