import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from '../auth/entities/user.entity';
import { CentroSalud } from '../user/entities/centro-salud.entity';
import { CreateHospitalDto } from './dto/create-hospital.dto';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(CentroSalud.name)
    private readonly centroSaludModel: Model<CentroSalud>,
  ) {}

  async createHospital(dto: CreateHospitalDto) {
    return this.centroSaludModel.create(dto);
  }

  async getCentrosSalud() {
    return this.centroSaludModel.find().select('nombre direccion');
  }

  async inviteDoctor(doctorId: string) {
    const doctor = await this.userModel.findById(doctorId);
    if (!doctor) throw new NotFoundException('Médico no encontrado');

    const verificationCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    doctor.verificationCode = verificationCode;

    await doctor.save();

    return {
      message: 'Código generado exitosamente',
      doctorId: doctor._id,
      verificationCode,
    };
  }

  getDoctors() {
    return this.userModel.find({ role: 'medico' });
  }
}
