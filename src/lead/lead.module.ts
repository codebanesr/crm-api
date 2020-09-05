import { Module } from "@nestjs/common";
import { LeadService } from "./lead.service";
import { LeadController } from "./lead.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { LeadSchema } from "./schema/lead.schema";
import { UserSchema } from "../user/schemas/user.schema";
import { CampaignConfigSchema } from "./schema/campaign-config.schema";
import { EmailTemplateSchema } from "./schema/email-templates.schema";
import { CallLogSchema } from "./schema/call-log.schema";
import { GeoLocationSchema } from "./schema/geo-location.schema";
import { AlarmSchema } from "./schema/alarm.schema";
import { CampaignSchema } from "src/campaign/schema/campaign.schema";
import { MulterModule } from "@nestjs/platform-express";

@Module({
  imports: [
    MulterModule.register({
      dest: '~/.upload',
    }),
    MongooseModule.forFeature([
      { name: "Alarm", schema: AlarmSchema },
      { name: "Campaign", schema: CampaignSchema},
      { name: "GeoLocation", schema: GeoLocationSchema },
      { name: "CallLog", schema: CallLogSchema },
      { name: "EmailTemplate", schema: EmailTemplateSchema },
      { name: "CampaignConfig", schema: CampaignConfigSchema },
      { name: "User", schema: UserSchema },
      { name: "Lead", schema: LeadSchema }
    ]),
  ],
  providers: [LeadService],
  controllers: [LeadController],
})
export class LeadModule {}
