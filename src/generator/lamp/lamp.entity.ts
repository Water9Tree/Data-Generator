import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type LampDocument = Lamp & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Lamp {
  @Prop()
  lampId: number;

  @Prop()
  lampName: string;

  @Prop({
    type: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
    _id: false,
    required: true,
  })
  location: {
    x: number;
    y: number;
  };

  @Prop()
  adjoiningPlace: string;

  @Prop({ enum: ['light', 'dark'], default: 'light' })
  status?: 'light' | 'dark';

  @Prop({ default: false })
  isFavorite?: boolean;

  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  createdAt: Date;

  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  updatedAt: Date;
}

export const LampSchema = SchemaFactory.createForClass(Lamp);
