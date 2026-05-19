import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from 'src/auth/entities/user.entity';
import { Doctor, DoctorSchema } from 'src/user/entities/doctor.entity';
import { Patient, PatientSchema } from 'src/user/entities/patient.entity';
import {
  CentroSalud,
  CentroSaludSchema,
} from 'src/user/entities/centro-salud.entity';
import {
  Appointment,
  AppointmentSchema,
} from 'src/appointment/entities/appointment.entity';
import {
  Medication,
  MedicationSchema,
} from 'src/medications/entities/medication.entity';
import { Mood, MoodSchema } from 'src/mood/entities/mood.entity';
import {
  ResultadoEstudio,
  ResultadoEstudioSchema,
} from 'src/user/entities/resultado-estudio.entity';
import {
  VinculacionPacienteCuidador,
  VinculacionPacienteCuidadorSchema,
} from 'src/vinculacion/entities/vinculacion.entity';

import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  imports: [
    // Registra todos los modelos directamente para evitar circular deps
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: Patient.name, schema: PatientSchema },
      { name: CentroSalud.name, schema: CentroSaludSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Medication.name, schema: MedicationSchema },
      { name: Mood.name, schema: MoodSchema },
      { name: ResultadoEstudio.name, schema: ResultadoEstudioSchema },
      {
        name: VinculacionPacienteCuidador.name,
        schema: VinculacionPacienteCuidadorSchema,
      },
    ]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
