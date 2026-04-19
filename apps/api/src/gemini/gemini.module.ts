import { Module } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { GeminiController } from './gemini.controller';
import { GeminiToolsModule } from 'src/gemini-tools/gemini-tools.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [GeminiToolsModule, AuthModule],
  controllers: [GeminiController],
  providers: [GeminiService],
})
export class GeminiModule {}
