import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignSchema } from '../campaign/schema/campaign.schema';
import { CallLogSchema } from '../lead/schema/call-log.schema';
import { CampaignConfigSchema } from '../lead/schema/campaign-config.schema';
import { EmailTemplateSchema } from '../lead/schema/email-templates.schema';
import { GeoLocationSchema } from '../lead/schema/geo-location.schema';
import { LeadSchema } from '../lead/schema/lead.schema';
import { UserSchema } from '../user/schemas/user.schema';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Campaign", schema: CampaignSchema},
      { name: "GeoLocation", schema: GeoLocationSchema },
      { name: "CallLog", schema: CallLogSchema },
      { name: "EmailTemplate", schema: EmailTemplateSchema },
      { name: "CampaignConfig", schema: CampaignConfigSchema },
      { name: "User", schema: UserSchema },
      { name: "Lead", schema: LeadSchema }
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}
