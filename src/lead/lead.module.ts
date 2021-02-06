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
import { CampaignSchema } from "../campaign/schema/campaign.schema";
import { MulterModule } from "@nestjs/platform-express";
import { AdminActionSchema } from "../user/schemas/admin-action.schema";
import { UploadService } from "../upload/upload.service";
import { PushNotificationService } from "../push-notification/push-notification.service";
import { LeadHistory } from "./schema/lead-history.schema";
import { RulesModule } from "../rules/rules.module";
import { LeadAnalyticService } from "./lead-analytic.service";
import { LeadAnalyticController } from "./lead-analytic.controller";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    RulesModule,
    UserModule,
    MulterModule.register({
      dest: "~/.upload",
    }),
    MongooseModule.forFeature([
      { name: "Alarm", schema: AlarmSchema },
      { name: "Campaign", schema: CampaignSchema },
      { name: "GeoLocation", schema: GeoLocationSchema },
      { name: "CallLog", schema: CallLogSchema },
      { name: "EmailTemplate", schema: EmailTemplateSchema },
      { name: "CampaignConfig", schema: CampaignConfigSchema },
      { name: "User", schema: UserSchema },
      { name: "Lead", schema: LeadSchema },
      { name: "AdminAction", schema: AdminActionSchema },
      { name: "LeadHistory", schema: LeadHistory },
    ]),
  ],
  providers: [LeadService, UploadService, PushNotificationService, LeadAnalyticService],
  controllers: [LeadController, LeadAnalyticController],
})
export class LeadModule {}
