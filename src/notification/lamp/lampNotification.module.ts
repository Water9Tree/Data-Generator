import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Building,
  BuildingSchema,
} from '../../generator/trashcan/building.entity';
import { Lamp, LampSchema } from '../../generator/lamp/lamp.entity';
import { User, UserSchema } from './user/user.entity';
import { LampsNotificationService } from './lampNotification.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Building.name, schema: BuildingSchema },
      { name: Lamp.name, schema: LampSchema },
    ]),
  ],
  providers: [LampsNotificationService],
})
export class LampsNotificationModule {}
