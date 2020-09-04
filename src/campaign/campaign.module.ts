import { Module } from "@nestjs/common";
import { CampaignService } from "./campaign.service";
import { CampaignController } from "./campaign.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { CampaignSchema } from "./schema/campaign.schema";
import { CampaignConfigSchema } from "src/lead/schema/campaign-config.schema";
import { DispositionSchema } from "./schema/disposition.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Campaign', schema: CampaignSchema }]),
    MongooseModule.forFeature([{ name: 'CampaignConfig', schema: CampaignConfigSchema }]),
    MongooseModule.forFeature([{ name: 'Disposition', schema: DispositionSchema }]),
  ],
  controllers: [CampaignController],
  providers: [CampaignService],
})
export class CampaignModule {}
