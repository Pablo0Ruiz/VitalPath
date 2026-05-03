import { Module } from '@nestjs/common';
import { GroqService } from './groq.service';
import { GroqController } from './groq.controller';
import { GroqToolsModule } from 'src/groq-tools/groq-tools.module';
import { AuthModule } from 'src/auth/auth.module';

import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationSchema,
} from './entities/conversation.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    GroqToolsModule,
    AuthModule,
  ],
  controllers: [GroqController],
  providers: [GroqService],
  exports: [GroqService],
})
export class GroqModule {}
