import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';
import { Doctor } from './entities/doctor.entity';
import { Patient } from './entities/patient.entity';
import { UserRoles } from 'src/auth/enum/user-role.enum';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Doctor.name) private readonly doctorModel: Model<Doctor>,
    @InjectModel(Patient.name) private readonly patientModel: Model<Patient>,
  ) {}

  async getUserProfile(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) throw new Error('Error al obtener el perfil');

    let profile = null;
    if (user.role === UserRoles.PACIENTE) {
      profile = await this.patientModel
        .findOne({ user: userId })
        .populate('medications')
        .populate('resultadosEstudio')
        .populate('citas');
    } else if (user.role === UserRoles.MEDICO) {
      profile = await this.doctorModel
        .findOne({ user: userId })
        .populate('citas');
    }

    return {
      ...user.toObject(),
      profile,
    };
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(userId, updateUserDto, {
      returnDocument: 'after',
    });

    if (!user) throw new Error('Usuario no encontrado');

    return user.toObject();
  }
}
