import { GoneException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isHexadecimal, isMongoId } from 'class-validator';
import { Model } from 'mongoose';
import { Lead } from 'src/lead/dto/update-lead.dto';
import { LeadHistory } from 'src/lead/interfaces/lead-history.interface';
import { ChangeStateDto } from './dto/changeState.dto';
import { RuleDto } from './dto/rule.dto';
import { Trigger } from './rules.constants';
import { Rules } from './rules.interface';
import axios from "axios";

@Injectable()
export class RulesService {
    @InjectModel("Rule")
    private readonly ruleModel: Model<Rules>


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
        lead: Lead, 
        history: LeadHistory
    ): Promise<{lead: Lead, history: LeadHistory}> {
        const rules = await this.ruleModel.find({campaign: campaignId, isActive: true});
        rules.forEach(rule=>{
            switch(rule.trigger) {
                case Trigger.changeHandler: {
                    break;
                }

                case Trigger.dispositionChange: {
                    break;
                }

                case Trigger.numberOfAttempts: {
                    break;
                }

                case Trigger.overdueFollowups: {
                    break;
                }

                case Trigger.repeatedDisposition: {
                    break;
                }
            }
        });

        return { lead, history }
    }


    async callApiAction(lead: Lead, url: string) {
        url.replace(/\$First name\$/g, lead.firstName);
        url.replace(/\$Last name\$/g, lead.firstName);
        url.replace(/\$Full name\$/g, lead.firstName);
        await axios.get(url);
    }
}
