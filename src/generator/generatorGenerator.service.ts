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
    // 쓰레기통 관련 처리
    this.buildingModel
      .find({})
      .then((buildings) => {
        // 생성되어 있는 모든 데이터 생성기 불러옴
        const allCronJobs = new Map(this.schedulerRegistry.getCronJobs());

        for (const building of buildings) {
          const buildingId = building.buildingNumber;

          // 생성된 층이 없을 경우 다음 build으로 넘어감.
          if (building.floors === null) continue;

          for (const floor of building.floors) {
            const floorId = floor.floorNumber;

            // 등록된 생성기가 있는 지 여부에 따른 처리
            if (this.isNotYetTrashcanCronJobRegistered(buildingId, floorId)) {
              // 등록된 생성기가 없을 경우 데이터 생성기 생성
              console.log(
                `buildingNumber: ${buildingId}, floorNumber: ${floorId}가 등록되었습니다.`,
              );

              const newJob = new CronJob(
                CronExpression.EVERY_10_SECONDS,
                () => {
                  trashcanGenerator(this.buildingModel, buildingId, floorId);
                },
              );

              this.schedulerRegistry.addCronJob(
                this.getTrashcanCronName(buildingId, floorId),
                newJob,
              );

              newJob.start();
            } else {
              // 등록된 생성기가 있을 경우 없어진 쓰레기통에 대한 생성기를 멈추는 작업에서 제거하기 위해 배열에서 제거
              allCronJobs.delete(this.getTrashcanCronName(buildingId, floorId));
            }
          }
        }
        return allCronJobs;
      })
      .then((allCronJobs) => {
        // 가로등 관련 처리
        this.lampModel
          .find({})
          .then((lamps) => {
            for (const lamp of lamps) {
              const lampId = lamp._id;

              if (this.isNotYetLampCronJobRegistered(lampId)) {
                console.log(`lampName: ${lamp.lampName} 가 등록되었습니다.`);

                const newJob = new CronJob(
                  CronExpression.EVERY_10_SECONDS,
                  () => {
                    lampGenerator(this.lampModel, lampId);
                  },
                );

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
