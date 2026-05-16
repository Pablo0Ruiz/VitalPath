import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Mood extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: ['1', '2', '3', '4', '5'] })
  mood: string;

  @Prop({ required: true, index: true })
  date: Date;
}

export const MoodSchema = SchemaFactory.createForClass(Mood);

MoodSchema.index({ userId: 1, date: 1 }, { unique: true });
