import { GoneException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isHexadecimal, isMongoId } from 'class-validator';
import { Model } from 'mongoose';
import { RuleDto } from './dto/rule.dto';
import { Rules } from './rules.interface';

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
        return this.ruleModel.find({campaign: campaignId}).skip(offset).limit(limit);
    }

    public async addRule(rule: RuleDto) {
        return this.ruleModel.create(rule);
    }
}
