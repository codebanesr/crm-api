import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationSchema } from './schema/organization.schema';
import { TwilioModule } from '@lkaric/twilio-nestjs';
import config from '../config';
import { RedisModule} from 'nestjs-redis'
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';


@Module({
  imports: [
    SharedModule,
    UserModule,
    RedisModule.register(config.redisOpts),
    TwilioModule.register({
      accountSid: config.twilio.accountSid,
      authToken: config.twilio.authToken,
    }),
    MongooseModule.forFeature([
      { name: "Organization", schema: OrganizationSchema }
    ]),
  ],
  providers: [OrganizationService],
  controllers: [OrganizationController]
})
export class OrganizationModule {}
