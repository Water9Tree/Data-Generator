import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/notification/trashcan/user/user.entity';
import { Model } from 'mongoose';
import {
  Building,
  BuildingDocument,
} from 'src/generator/trashcan/building.entity';

@Injectable()
export class TrashcanNotificationService {
  private trashCans50 = [];
  private trashCans80 = [];

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Building.name) private buildingModel: Model<BuildingDocument>,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  handleCron() {
    console.log('Called when the current second is 5');
    this.userModel
      .find({ role: ['ROLE_CLEANER', 'ROLE_ADMIN'] })
      .then((users) => {
        this.buildingModel.find({}).then((buildings) => {
          for (const building of buildings) {
            for (const floor of building.floors) {
              for (const user of users) {
                if (user.expoToken) {
                  this.checkAndSendPush(
                    user,
                    floor.trashCan?.status.regular,
                    building.buildingName,
                    building.buildingNumber,
                    floor.floorNumber,
                    '일반',
                  );
                  this.checkAndSendPush(
                    user,
                    floor.trashCan?.status.bottle,
                    building.buildingName,
                    building.buildingNumber,
                    floor.floorNumber,
                    '병',
                  );
                  this.checkAndSendPush(
                    user,
                    floor.trashCan?.status.paper,
                    building.buildingName,
                    building.buildingNumber,
                    floor.floorNumber,
                    '종이',
                  );
                  this.checkAndSendPush(
                    user,
                    floor.trashCan?.status.plastic,
                    building.buildingName,
                    building.buildingNumber,
                    floor.floorNumber,
                    '플라스틱',
                  );
                  console.log(user);
                }
              }
            }
          }
        });
      });
  }

  private checkAndSendPush(
    user: User,
    percentage: number,
    buildingName: string,
    buildingNumber: number,
    floorNumber: number,
    key: string,
  ) {
    const trashcanInfo =
      buildingNumber +
      ' ' +
      buildingName +
      ' ' +
      floorNumber +
      '층 ' +
      key +
      '쓰레기통';
    if (percentage < 50) {
      this.removeItemFromArray(this.trashCans50, trashcanInfo);
      this.removeItemFromArray(this.trashCans80, trashcanInfo);
      return;
    }
    if (percentage >= 50) {
      if (!this.trashCans50.includes(trashcanInfo)) {
        this.trashCans50.push(trashcanInfo);
        this.sendPush(user, trashcanInfo + '이 50%가 넘었습니다.');
        return;
      }
    }
    if (percentage >= 80) {
      if (!this.trashCans80.includes(trashcanInfo)) {
        this.trashCans80.push(trashcanInfo);
        this.sendPush(user, trashcanInfo + '이 80%가 넘었습니다.');
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

  private sendPush(user: User, trashcanInfo: string) {
    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: user.expoToken,
        title: `스마트 쓰레기통 알림`,
        body: trashcanInfo,
      }),
    })
      .then(() => console.log('send!'))
      .catch((err) => console.log(err));
  }
}
