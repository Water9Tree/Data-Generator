import { Floor } from './floor.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type BuildingDocument = Building & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Building {
  @Prop()
  buildingNumber: number;

  @Prop()
  buildingName: string;

  @Prop([Floor])
  floors: Floor[];

  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  createdAt: Date;

  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  updatedAt: Date;
}

export const BuildingSchema = SchemaFactory.createForClass(Building);
