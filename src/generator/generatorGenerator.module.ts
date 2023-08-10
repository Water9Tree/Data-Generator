import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { Building, BuildingSchema } from './trashcan/building.entity';
import { GeneratorGeneratorService } from './generatorGenerator.service';
import { Lamp, LampSchema } from './lamp/lamp.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: Building.name, schema: BuildingSchema },
      { name: Lamp.name, schema: LampSchema },
    ]),
  ],
  providers: [GeneratorGeneratorService],
})
export class GeneratorGeneratorModule {}
