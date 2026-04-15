import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Medication extends Document {
  @Prop({ required: true, index: true, lowercase: true })
  name: string;

  @Prop({ required: false, index: true, lowercase: true })
  description: string;
}

export const MedicationSchema = SchemaFactory.createForClass(Medication);
