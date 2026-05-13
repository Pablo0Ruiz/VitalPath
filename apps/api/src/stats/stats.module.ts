import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from 'src/auth/auth.module';
import {
  Appointment,
  AppointmentSchema,
} from 'src/appointment/entities/appointment.entity';
import { Patient, PatientSchema } from 'src/user/entities/patient.entity';
import { Doctor, DoctorSchema } from 'src/user/entities/doctor.entity';
import { Mood, MoodSchema } from 'src/mood/entities/mood.entity';

import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  controllers: [StatsController],
  providers: [StatsService],
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Patient.name, schema: PatientSchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: Mood.name, schema: MoodSchema },
    ]),
  ],
})
export class StatsModule {}
