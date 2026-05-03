import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Appointment,
  AppointmentSchema,
} from '../appointment/entities/appointment.entity';

import { Doctor, DoctorSchema } from '../user/entities/doctor.entity';
import { Patient, PatientSchema } from '../user/entities/patient.entity';
import { User, UserSchema } from '../auth/entities/user.entity';

@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService],
  imports: [
    AuthModule,
    UserModule,
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: Patient.name, schema: PatientSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  exports: [AppointmentService],
})
export class AppointmentModule {}
