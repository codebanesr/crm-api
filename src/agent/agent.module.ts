import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminActionSchema } from '../user/schemas/admin-action.schema';
import { UserSchema } from '../user/schemas/user.schema';
import { VisitTrackSchema } from './schemas/visit-track.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name: 'AdminAction', schema: AdminActionSchema},
      {name: 'User', schema: UserSchema},
      {name: 'VisitTrack', schema: VisitTrackSchema}
    ])
  ], 
  controllers: [AgentController],
  providers: [AgentService]
})
export class AgentModule {}
