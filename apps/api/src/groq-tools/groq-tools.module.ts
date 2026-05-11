import { Module } from '@nestjs/common';
import { GroqToolsService } from './groq-tools.service';
import { HospitalsModule } from 'src/hospitals/hospitals.module';
import { AppointmentModule } from 'src/appointment/appointment.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [HospitalsModule, AppointmentModule, UserModule],
  controllers: [],
  providers: [GroqToolsService],
  exports: [GroqToolsService],
})
export class GroqToolsModule {}
