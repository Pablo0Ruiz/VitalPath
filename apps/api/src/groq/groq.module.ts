import { Module } from '@nestjs/common';
import { GroqService } from './groq.service';
import { GroqController } from './groq.controller';
import { GroqToolsModule } from 'src/groq-tools/groq-tools.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [GroqToolsModule, AuthModule],
  controllers: [GroqController],
  providers: [GroqService],
  exports: [GroqService],
})
export class GroqModule {}
