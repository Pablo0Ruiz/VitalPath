import { Module } from '@nestjs/common';
import { GeminiToolsService } from './gemini-tools.service';
import { GeminiToolsController } from './gemini-tools.controller';
import { HospitalsModule } from 'src/hospitals/hospitals.module';
import { AppointmentModule } from 'src/appointment/appointment.module';

@Module({
  imports: [HospitalsModule, AppointmentModule],
  controllers: [GeminiToolsController],
  providers: [GeminiToolsService],
  exports: [GeminiToolsService],
})
export class GeminiToolsModule {}
