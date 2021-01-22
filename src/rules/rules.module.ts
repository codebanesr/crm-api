import { Module } from "@nestjs/common";
import { RulesService } from "./rules.service";
import { RulesController } from "./rules.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { RulesSchema } from "./rules.schema";
import { LeadHistory } from "../lead/schema/lead-history.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Rule", schema: RulesSchema },
      // { name: "Campaign", schema: CampaignSchema },
      // { name: "GeoLocation", schema: GeoLocationSchema },
      // { name: "CallLog", schema: CallLogSchema },
      // { name: "EmailTemplate", schema: EmailTemplateSchema },
      // { name: "CampaignConfig", schema: CampaignConfigSchema },
      // { name: "User", schema: UserSchema },
      // { name: "Lead", schema: LeadSchema },
      // { name: "AdminAction", schema: AdminActionSchema },
      { name: "LeadHistory", schema: LeadHistory },
    ]),
  ],
  providers: [RulesService],
  controllers: [RulesController],
  exports: [RulesService]
})
export class RulesModule {}
