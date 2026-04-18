import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from '../auth/entities/user.entity';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

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
}
