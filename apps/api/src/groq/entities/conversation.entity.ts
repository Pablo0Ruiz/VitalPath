import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop({ required: true, unique: true, index: true })
  chatId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  lastMessage?: string;

  @Prop({ type: [Object], default: [] })
  messages: Record<string, unknown>[];

  @Prop({ type: Date, default: Date.now, expires: 432000 })
  expireAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
