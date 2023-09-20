import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as os from 'os';
import { InjectModel } from '@nestjs/mongoose';
import { Lamp, LampDocument } from 'src/generator/lamp/lamp.entity';
import { User, UserDocument } from './user/user.entity';
import { Model, Types } from 'mongoose';
import {
  Building,
  BuildingDocument,
} from 'src/generator/trashcan/building.entity';

@Injectable()
export class LampsNotificationService {
  private lampsDark = [];
  private lampsLight = [];

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Lamp.name) private lampModel: Model<LampDocument>,
    @InjectModel(Building.name) private buildingModel: Model<BuildingDocument>,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  handleCron() {
    console.log('Called when the current second is 5');
    this.userModel.find({ role: 'ROLE_ADMIN' }).then((users) => {
      this.lampModel.find({}).then((lamps) => {
        for (const lamp of lamps) {
          for (const user of users) {
            if (user.expoToken) {
              this.checkAndSendPush(
                user,
                lamp.status,
                lamp.lampName,
                lamp.location,
              );
            }
          }
        }
      });
    });
  }

  private checkAndSendPush(
    user: User,
    status: 'light' | 'dark' | 'normal',
    lampName: string,
    location: any,
  ) {
    const lampInfo = lampName + '가로등';
    if (status == 'normal') {
      this.removeItemFromArray(this.lampsDark, lampInfo);
      this.removeItemFromArray(this.lampsLight, lampInfo);
      return;
    }
    if (status == 'dark') {
      if (!this.lampsDark.includes(lampInfo)) {
        this.lampsDark.push(lampInfo);
        this.removeItemFromArray(this.lampsLight, lampInfo);
        this.sendPush(user, lampInfo + '이 dark 상태입니다.');
        return;
      }
    }
    if (status == 'light') {
      if (!this.lampsLight.includes(lampInfo)) {
        this.lampsLight.push(lampInfo);
        this.removeItemFromArray(this.lampsDark, lampInfo);
        this.sendPush(user, lampInfo + '이 light 상태입니다.');
        return;
      }
    }
  }

  private removeItemFromArray(array: Array<any>, deleteItem: string) {
    const index = array.indexOf(deleteItem, 0);
    if (index > -1) {
      array.splice(index, 1);
    }
  }

  private sendPush(user: User, lampInfo: string) {
    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: user.expoToken,
        title: os?.hostname(),
        body: lampInfo,
      }),
    })
      .then(() => console.log('send!'))
      .catch((err) => console.log(err));
  }
}
