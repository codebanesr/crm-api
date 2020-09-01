import { Module } from '@nestjs/common';
import { LeadService } from './lead.service';
import { LeadController } from './lead.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LeadSchema } from './schema/lead.schema';
import { UserSchema } from 'src/user/schemas/user.schema';
import { CampaignConfigSchema } from './schema/campaign-config.schema';
import { EmailTemplateSchema } from './schema/email-templates.schema';
import { CallLogSchema } from './schema/call-log.schema';
import { GeoLocationSchema } from './schema/geo-location.schema';
import { AlarmSchema } from './schema/alarm.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{name: 'Lead', schema: LeadSchema}]),
    MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
    MongooseModule.forFeature([{name: 'CampaignConfig', schema: CampaignConfigSchema}]),
    MongooseModule.forFeature([{name: 'EmailTemplate', schema: EmailTemplateSchema}]),
    MongooseModule.forFeature([{name: 'CallLog', schema: CallLogSchema}]),
    MongooseModule.forFeature([{name: 'GeoLocation', schema: GeoLocationSchema}]),
    MongooseModule.forFeature([{name: 'Alarm', schema: AlarmSchema}]),
  ],
  providers: [LeadService],
  controllers: [LeadController]
})
export class LeadModule {}
