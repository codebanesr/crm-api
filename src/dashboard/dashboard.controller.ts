import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/interfaces/user.interface';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {

    constructor(private readonly dashboardService: DashboardService) {}


    @Post('leadStatus')
    @UseGuards(AuthGuard("jwt"))
    @Roles("admin")
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: "Get aggregated Lead Status for a given date range" })
    @ApiCreatedResponse({})
    async register(
      @CurrentUser() user: User,
      @Body() body: any
    ) {
        const {dateArray} = body;
        return this.dashboardService.getAggregatedLeadStatus(dateArray);
    }
}
