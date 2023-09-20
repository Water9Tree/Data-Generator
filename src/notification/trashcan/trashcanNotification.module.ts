import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Building,
  BuildingSchema,
} from '../../generator/trashcan/building.entity';
import { Lamp, LampSchema } from '../../generator/lamp/lamp.entity';
import { User, UserSchema } from '../trashcan/user/user.entity';
import { TrashcanNotificationService } from './trashcanNotification.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Building.name, schema: BuildingSchema },
      { name: Lamp.name, schema: LampSchema },
    ]),
  ],
  providers: [TrashcanNotificationService],
})
export class TrashcanNotificationModule {}
