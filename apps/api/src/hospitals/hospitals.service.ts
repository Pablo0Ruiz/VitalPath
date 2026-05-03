import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from '../auth/entities/user.entity';
import {
  CentroSalud,
  HospitalType,
} from '../user/entities/centro-salud.entity';
import { Doctor } from '../user/entities/doctor.entity';
import { CreateHospitalDto } from './dto/create-hospital.dto';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Doctor.name) private readonly doctorModel: Model<Doctor>,
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
    const doctor = await this.doctorModel.findById(doctorId);
    if (!doctor) throw new NotFoundException('Médico no encontrado');

    let hospital;
    if (hospitalId) {
      hospital = await this.centroSaludModel.findById(hospitalId);
    } else {
      const hospitals = await this.centroSaludModel.find();
      if (hospitals.length === 0)
        throw new NotFoundException('No hay hospitales registrados');
      const hospitalsWithCount = await Promise.all(
        hospitals.map(async h => {
          const pendingInvites = await this.userModel.countDocuments({
            verificationCode: h.codigoVinculacion,
            isActive: false,
          });

          return {
            hospital: h,
            totalWeight: (h.listaMedicos_ID?.length || 0) + pendingInvites,
          };
        }),
      );
      const sorted = hospitalsWithCount.sort(
        (a, b) => a.totalWeight - b.totalWeight,
      );
      hospital = sorted[0].hospital;
    }

    if (!hospital) {
      throw new NotFoundException(
        hospitalId
          ? 'Hospital especificado no encontrado'
          : 'No hay hospitales registrados',
      );
    }
    const verificationCode = hospital.codigoVinculacion;

    const userUpdate = await this.userModel.findByIdAndUpdate(
      doctor.user,
      { verificationCode },
      { returnDocument: 'after' },
    );

    if (!userUpdate)
      throw new NotFoundException('Usuario asociado no encontrado');

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
    return this.doctorModel.find().populate({
      path: 'user',
      populate: {
        path: 'centroSalud_ID',
      },
    });
  }
}
