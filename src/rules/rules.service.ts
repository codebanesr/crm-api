import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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

    public async getAllRules(limit: number, offset: number) {
        return this.ruleModel.find().skip(offset).limit(limit);
    }

    public async addRule(rule: RuleDto) {
        return this.ruleModel.create(rule);
    }
}
