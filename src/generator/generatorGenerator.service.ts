import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Lamp, LampDocument } from './lamp/lamp.entity';
import { Model, Types } from 'mongoose';
import { Building, BuildingDocument } from './trashcan/building.entity';
import { CronJob } from 'cron';
import trashcanGenerator from './trashcan/trashcanGenerator.service';
import lampGenerator from './lamp/lampGenerator.service';

@Injectable()
export class GeneratorGeneratorService {
  private TRASHCAN = 'TRASHCAN';
  private LAMP = 'LAMP';

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    @InjectModel(Lamp.name) private lampModel: Model<LampDocument>,
    @InjectModel(Building.name) private buildingModel: Model<BuildingDocument>,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  handleCron() {
    this.buildingModel
      .find({})
      .then((buildings) => {
        const allCronJobs = new Map(this.schedulerRegistry.getCronJobs());
        for (const building of buildings) {
          const buildingId = building.buildingNumber;
          if (building.floors === null) continue;
          for (const floor of building.floors) {
            const floorId = floor.floorNumber;
            if (this.isNotYetTrashcanCronJobRegistered(buildingId, floorId)) {
              console.log(
                `buildingNumber: ${buildingId}, floorNumber: ${floorId}가 등록되었습니다.`,
              );
              const newJob = new CronJob(CronExpression.EVERY_SECOND, () => {
                trashcanGenerator(this.buildingModel, buildingId, floorId);
              });
              this.schedulerRegistry.addCronJob(
                this.getTrashcanCronName(buildingId, floorId),
                newJob,
              );
              newJob.start();
            } else {
              allCronJobs.delete(this.getTrashcanCronName(buildingId, floorId));
            }
          }
        }
        return allCronJobs;
      })
      .then((allCronJobs) => {
        this.lampModel
          .find({})
          .then((lamps) => {
            for (const lamp of lamps) {
              const lampId = lamp._id;
              if (this.isNotYetLampCronJobRegistered(lampId)) {
                console.log(`lampName: ${lamp.lampName} 가 등록되었습니다.`);
                const newJob = new CronJob(CronExpression.EVERY_SECOND, () => {
                  lampGenerator(this.lampModel, lampId);
                });
                this.schedulerRegistry.addCronJob(
                  this.getLampCronName(lampId),
                  newJob,
                );
                newJob.start();
              } else {
                allCronJobs.delete(this.getLampCronName(lampId));
              }
            }
            return allCronJobs;
          })
          .then((allCronJobs) => {
            // 호출되지 않은 job들은 삭제된 것으로 판단하고 cronjob stop.
            allCronJobs.forEach((deletedJob, jobName) => {
              if (
                jobName.startsWith(this.TRASHCAN) ||
                jobName.startsWith(this.LAMP)
              ) {
                console.log(`${jobName} is stop!!`);
                this.schedulerRegistry.deleteCronJob(jobName);
                deletedJob.stop();
              }
            });
          });
      });
  }

  isNotYetTrashcanCronJobRegistered(buildingId: number, floorId: number) {
    return !this.schedulerRegistry.doesExist(
      'cron',
      this.getTrashcanCronName(buildingId, floorId),
    );
  }

  isNotYetLampCronJobRegistered(lampId: Types.ObjectId) {
    return !this.schedulerRegistry.doesExist(
      'cron',
      this.getLampCronName(lampId),
    );
  }

  getTrashcanCronName(buildingId: number, floorId: number) {
    return this.TRASHCAN + '_' + buildingId + '_' + floorId;
  }

  getLampCronName(lampId: Types.ObjectId) {
    return this.LAMP + '_' + lampId;
  }
}
