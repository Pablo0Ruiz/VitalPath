import { Module } from '@nestjs/common';
import { GroqToolsService } from './groq-tools.service';
import { GroqToolsController } from './groq-tools.controller';
import { HospitalsModule } from 'src/hospitals/hospitals.module';
import { AppointmentModule } from 'src/appointment/appointment.module';

@Module({
  imports: [HospitalsModule, AppointmentModule],
  controllers: [GroqToolsController],
  providers: [GroqToolsService],
  exports: [GroqToolsService],
})
export class GroqToolsModule {}
