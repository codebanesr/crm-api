import { GoneException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isMongoId } from 'class-validator';
import { Document, Model } from 'mongoose';
import { LeadHistory } from '../lead/interfaces/lead-history.interface';
import { ChangeStateDto } from './dto/changeState.dto';
import { RuleDto } from './dto/rule.dto';
import { EActions, Trigger } from './rules.constants';
import { Rules } from './rules.interface';
import axios from "axios";
import { Lead } from '../lead/interfaces/lead.interface';
import { Lead as UpdateLeadDto } from '../lead/dto/lead-model.dto';
import * as moment from "moment";

@Injectable()
export class RulesService {
    @InjectModel("Rule")
    private readonly ruleModel: Model<Rules>;

    @InjectModel("LeadHistory")
    private readonly leadHistoryModel: Model<LeadHistory>;


    public async getRuleById(id: string) {
        return this.ruleModel.findById(id).lean().exec();
    }

    public async getAllRules(campaignId: string, limit: number, offset: number) {
        if(!isMongoId(campaignId)) {
            throw new GoneException("Campaign Id is not a valid mongoId")
        }
        return this.ruleModel.find({campaign: campaignId}).skip(offset).limit(limit).lean().exec();
    }

    public async addRule(rule: RuleDto) {
        return this.ruleModel.create(rule);
    }


    public async changeState(changeStateDto: ChangeStateDto) {
        return this.ruleModel.findOneAndUpdate(
            {_id: changeStateDto.ruleId}, 
            {isActive: changeStateDto.isActive}, 
            {new: true}
        ).lean().exec();
    }

    public async applyRules(
        campaignId: string, 
        lead: Omit<Lead, keyof Document> & {_id: string}, /** @Todo after lean().exec() _id might not be present check this*/
        leadDto: UpdateLeadDto,
        nextEntryInHistory: LeadHistory,
    ): Promise<{ lead: Omit<Lead, keyof Document>, nextEntryInHistory: LeadHistory }> {
        const rules = await this.ruleModel.find({campaign: campaignId, isActive: true}).limit(4).lean().exec();
        // prevent this from calling multiple database queries;
        let noa;
        let lastKDispositions;
        rules.forEach(async rule=>{
            switch(rule.trigger) {
                case Trigger.changeHandler: {
                    this.triggerAction(rule, lead, leadDto, nextEntryInHistory);
                    break;
                }

                case Trigger.dispositionChange: {
                    const {fromDisposition, toDisposition} = rule;
                    if(lead.leadStatus === fromDisposition && leadDto.leadStatus === toDisposition) {
                        this.triggerAction(rule, lead, leadDto, nextEntryInHistory);
                    }
                    break;
                }

                case Trigger.numberOfAttempts: {
                    /** @Todo if two rules are for number of attempts this result should be cached */
                    if(!noa) {
                        noa = await this.leadHistoryModel.countDocuments({lead: lead._id});
                    }
                    if(noa > rule.numberOfAttempts) {
                        this.triggerAction(rule, lead, leadDto, nextEntryInHistory);
                    }
                    break;
                }

                case Trigger.overdueFollowups: {
                    const followUp = moment(lead.followUp);
                    const today = moment();
                    if(today.diff(followUp, 'days') > rule.daysOverdue) {
                        this.triggerAction(rule, lead, leadDto, nextEntryInHistory);
                    }
                    break;
                }

                case Trigger.repeatedDisposition: {
                    const k = rule.numberOfAttempts;
                    if(!lastKDispositions) {
                        lastKDispositions = await this.leadHistoryModel.find({lead: lead._id}).sort({updatedAt: -1}).limit(k).lean().exec();
                    }

                    if(lastKDispositions.length === k && lastKDispositions.every(d=>d===rule.disposition)) {
                        this.triggerAction(rule, lead, leadDto, nextEntryInHistory);
                    }   

                    break;
                }
            }
        });

        return { lead, nextEntryInHistory }
    }

    async triggerAction(rule: Omit<Rules, keyof Document> & {_id: string}, lead: Omit<Lead, keyof Document>, leadDto: UpdateLeadDto, nextEntryInHistory: Omit<LeadHistory, keyof Document>) {
        const { newDisposition, action, newHandler } = rule;
        if(action === EActions.changeDisposition) {
            leadDto.leadStatus = newDisposition;
            nextEntryInHistory.leadStatus = newDisposition;
            nextEntryInHistory.notes += `\n, changed due to rule ${rule._id}`;
        }else if(action === EActions.callApi) {
            this.callApiAction(lead, rule.url);
            nextEntryInHistory.notes += `\n API called`;
        }else if(action === EActions.changeProspectHandler) {
            /** @Todo ye fail karega, use mongo id for handler not email */
            nextEntryInHistory.notes += `\n prospect handler changed from ${leadDto.email} to ${newHandler} for rule ${rule._id}`;
            leadDto.email = newHandler;
        } else{
            Logger.debug("No action matched the trigger in rules.service.ts!!!!!");
        }
    }

    async callApiAction(lead: Omit<Lead, keyof Document>, url: string) {
        url.replace(/\$First name\$/g, lead.firstName);
        url.replace(/\$Last name\$/g, lead.firstName);
        url.replace(/\$Full name\$/g, lead.firstName);
        await axios.get(url);
    }
}
