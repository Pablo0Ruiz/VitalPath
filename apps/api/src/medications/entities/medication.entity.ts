import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Medication extends Document {
  @Prop({ required: true, index: true, lowercase: true })
  name: string;

  @Prop({ required: false, index: true, lowercase: true })
  description: string;

  @Prop({ required: false })
  startTime?: string;

  @Prop({ required: true, enum: [4, 6, 8, 12, 24], default: 24 })
  frequencyHours: number;

  @Prop({ required: false })
  durationDays?: number;

  @Prop({ required: true, default: 0 })
  dosesTaken: number;

  @Prop({ type: [String], default: [] })
  notificationIds: string[];
}

export const MedicationSchema = SchemaFactory.createForClass(Medication);
