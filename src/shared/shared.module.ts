import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationService } from '../utils/notification.service';
import { OrganizationSchema, ResellerOrganizationSchema } from '../organization/schema';
import { UserSchema } from '../user/schemas/user.schema';
import { SharedService } from './shared.service';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: "User", schema: UserSchema },
      { name: "Organization", schema: OrganizationSchema },
      { name: "ResellerOrganization", schema: ResellerOrganizationSchema },
    ]),
  ],
  providers: [SharedService, NotificationService],
  exports:[SharedService, NotificationService]
})
export class SharedModule {}
