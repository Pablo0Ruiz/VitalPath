import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Doctor, DoctorSchema } from './entities/doctor.entity';
import { Patient, PatientSchema } from './entities/patient.entity';
import { CentroSalud, CentroSaludSchema } from './entities/centro-salud.entity';
import {
  ResultadoEstudio,
  ResultadoEstudioSchema,
} from './entities/resultado-estudio.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    MongooseModule.forFeature([
      { name: Doctor.name, schema: DoctorSchema },
      { name: Patient.name, schema: PatientSchema },
      { name: CentroSalud.name, schema: CentroSaludSchema },
      { name: ResultadoEstudio.name, schema: ResultadoEstudioSchema },
    ]),
    AuthModule,
  ],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
