import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from '../auth/entities/user.entity';
import {
  CentroSalud,
  HospitalType,
} from '../user/entities/centro-salud.entity';
import { CreateHospitalDto } from './dto/create-hospital.dto';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(CentroSalud.name)
    private readonly centroSaludModel: Model<CentroSalud>,
  ) {}

  async createHospital(dto: CreateHospitalDto) {
    const { tipo = HospitalType.GENERAL, codigoVinculacion } = dto;

    const finalCode =
      codigoVinculacion ||
      `${tipo}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    return this.centroSaludModel.create({
      ...dto,
      codigoVinculacion: finalCode,
      tipo,
    });
  }

  async getCentrosSalud() {
    return this.centroSaludModel
      .find()
      .select('nombre direccion tipo codigoVinculacion');
  }

  async inviteDoctor(doctorId: string, hospitalId?: string) {
    const doctor = await this.userModel.findById(doctorId);
    if (!doctor) throw new NotFoundException('Médico no encontrado');

    let hospital;
    if (hospitalId) {
      hospital = await this.centroSaludModel.findById(hospitalId);
    } else {
      hospital = await this.centroSaludModel.findOne();
    }

    if (!hospital) throw new NotFoundException('No hay hospitales registrados');
    const verificationCode = hospital.codigoVinculacion;

    doctor.verificationCode = verificationCode;
    await doctor.save();

    return {
      message: 'Invitación enviada exitosamente',
      doctorId: doctor._id,
      hospital: {
        nombre: hospital.nombre,
        codigoVinculacion: hospital.codigoVinculacion,
      },
    };
  }

  getDoctors() {
    return this.userModel.find({ role: 'medico' });
  }
}
