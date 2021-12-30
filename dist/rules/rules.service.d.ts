import { Document } from 'mongoose';
import { LeadHistory } from '../lead/interfaces/lead-history.interface';
import { ChangeStateDto } from './dto/changeState.dto';
import { RuleDto } from './dto/rule.dto';
import { Rules } from './rules.interface';
import { Lead } from '../lead/interfaces/lead.interface';
import { Lead as UpdateLeadDto } from '../lead/dto/lead-model.dto';
import { Logger } from 'nestjs-pino';
export declare class RulesService {
    private logger;
    constructor(logger: Logger);
    private readonly ruleModel;
    private readonly leadHistoryModel;
    getRuleById(id: string): Promise<Pick<Rules, "_id" | "url" | "trigger" | "campaign" | "isActive" | "action" | "changeHandler" | "daysOverdue" | "disposition" | "fromDisposition" | "newDisposition" | "newHandler" | "numberOfAttempts" | "toDisposition">>;
    getAllRules(campaignId: string, limit: number, offset: number): Promise<Pick<Rules, "_id" | "url" | "trigger" | "campaign" | "isActive" | "action" | "changeHandler" | "daysOverdue" | "disposition" | "fromDisposition" | "newDisposition" | "newHandler" | "numberOfAttempts" | "toDisposition">[]>;
    addRule(rule: RuleDto): Promise<Rules>;
    changeState(changeStateDto: ChangeStateDto): Promise<Pick<Rules, "_id" | "url" | "trigger" | "campaign" | "isActive" | "action" | "changeHandler" | "daysOverdue" | "disposition" | "fromDisposition" | "newDisposition" | "newHandler" | "numberOfAttempts" | "toDisposition">>;
    applyRules(campaignId: string, lead: Omit<Lead, keyof Document> & {
        _id: string;
    }, leadDto: UpdateLeadDto, nextEntryInHistory: LeadHistory): Promise<{
        lead: Omit<Lead, keyof Document>;
        nextEntryInHistory: LeadHistory;
    }>;
    triggerAction(rule: Omit<Rules, keyof Document> & {
        _id: string;
    }, lead: Omit<Lead, keyof Document>, leadDto: UpdateLeadDto, nextEntryInHistory: Omit<LeadHistory, keyof Document>): Promise<void>;
    callApiAction(lead: Omit<Lead, keyof Document>, url: string): Promise<void>;
}
