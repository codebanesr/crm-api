import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { RuleDto } from './dto/rule.dto';
import { RulesService } from './rules.service';

@ApiTags('Rules')
@Controller('rules')
export class RulesController {
    constructor(private readonly rulesService: RulesService) {}

    @Get("")
    @UseGuards(AuthGuard("jwt"))
    getAllRules(@Query('limit') limit: number, @Query('offset') offset: number) {
        return this.rulesService.getAllRules(limit, offset)
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
}

