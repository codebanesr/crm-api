import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { ChangeStateDto } from './dto/changeState.dto';
import { RuleDto } from './dto/rule.dto';
import { RulesService } from './rules.service';

@ApiTags('Rules')
@Controller('rules')
export class RulesController {
    constructor(private readonly rulesService: RulesService) {}

    @Get("/all/:campaignId")
    @UseGuards(AuthGuard("jwt"))
    getAllRules(@Query('limit') limit: number, @Query('offset') offset: number, @Param('campaignId') campaignId: string) {
        return this.rulesService.getAllRules(campaignId, limit, offset)
    }

    @Get(":id")
    @UseGuards(AuthGuard("jwt"))
    getRuleById(@Param('id') ruleId: string) {
        return this.rulesService.getRuleById(ruleId);
    }

    @Post()
    @UseGuards(AuthGuard("jwt"))
    addRule(@Body() ruleDto: RuleDto) {
        return this.rulesService.addRule(ruleDto);
    }


    @Post("changeState")
    @UseGuards(AuthGuard("jwt"))
    changeRuleState(@Body() changeStateDto: ChangeStateDto) {
        return this.rulesService.changeState(changeStateDto);
    }
}

