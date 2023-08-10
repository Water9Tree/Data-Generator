import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Can } from './can.entity';
import mongoose from 'mongoose';

export type FloorDocument = Floor & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Floor {
  @Prop()
  floorNumber: number;

  @Prop(Can)
  trashCan: Can;

  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  createdAt: Date;

  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  updatedAt: Date;
}

export const FloorSchema = SchemaFactory.createForClass(Floor);
