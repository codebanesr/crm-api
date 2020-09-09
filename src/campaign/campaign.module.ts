import { Module } from "@nestjs/common";
import { CampaignService } from "./campaign.service";
import { CampaignController } from "./campaign.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { CampaignSchema } from "./schema/campaign.schema";
import { CampaignConfigSchema } from "../lead/schema/campaign-config.schema";
import { DispositionSchema } from "./schema/disposition.schema";
import { MulterModule } from "@nestjs/platform-express";
import { AdminActionSchema } from "../user/schemas/admin-action.schema";

@Module({
  imports: [
    MulterModule.register({
      dest: '~/.upload',
    }),
    MongooseModule.forFeature([
      { name: 'Campaign', schema: CampaignSchema }, 
      { name: 'CampaignConfig', schema: CampaignConfigSchema },
      { name: 'Disposition', schema: DispositionSchema },
      { name: "AdminAction", schema: AdminActionSchema },
    ])
  ],
  controllers: [CampaignController],
  providers: [CampaignService],
})
export class CampaignModule {}
