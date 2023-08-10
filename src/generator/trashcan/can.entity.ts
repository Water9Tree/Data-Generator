import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type CanDocument = Can & Document;

class Status {
  regular: number;
  bottle: number;
  plastic: number;
  paper: number;
}

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Can {
  @Prop()
  _id: mongoose.Types.ObjectId;

  @Prop()
  status: Status;

  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  createdAt: Date;

  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  updatedAt: Date;
}

export const CanSchema = SchemaFactory.createForClass(Can);
