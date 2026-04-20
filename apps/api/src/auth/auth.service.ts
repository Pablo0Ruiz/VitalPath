import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import {
  CreateDoctorDto,
  CreateUserDto,
  InviteDoctorDto,
  LoginUserDto,
} from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { handleServiceException } from 'src/common/helpers/handle-exceptions.helper';
import { EmailService } from 'src/common/email/email.service';
import recoverPasswordEmailTemplate from 'src/common/template/recover-password-email.template';

import { Doctor } from 'src/user/entities/doctor.entity';
import { Patient } from 'src/user/entities/patient.entity';
import { UserRoles } from './enum/user-role.enum';
import { Especialidad } from './enum/especialidad.enum';

type CreateDtoRegister = CreateUserDto | CreateDoctorDto;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Doctor.name)
    private readonly doctorModel: Model<Doctor>,
    @InjectModel(Patient.name)
    private readonly patientModel: Model<Patient>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async create(createUserDto: CreateDtoRegister) {
    try {
      const { password, ...userData } = createUserDto;

      if (!userData.role) {
        userData.role = UserRoles.PACIENTE;
      }

      const user = await this.userModel.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      if (user.role === UserRoles.PACIENTE) {
        await this.patientModel.create({ user: user._id });
      } else if (user.role === UserRoles.MEDICO) {
        const doctorData = userData as CreateDoctorDto;
        await this.doctorModel.create({
          user: user._id,
          especialidad:
            doctorData.especialidad || Especialidad.MEDICINA_GENERAL,
        });
      }

      const { password: _, ...userWithoutPassword } = user.toObject();

      return {
        user: userWithoutPassword,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      handleServiceException(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userModel.findOne({ email }).select('+password');

    if (!user) throw new UnauthorizedException('El correo es incorrecto');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('La contraseña es incorrecta');

    const { password: _, ...userWithoutPassword } = user.toObject();

    return {
      user: userWithoutPassword,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async loginWithId(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) throw new UnauthorizedException('El usuario no existe');

    const { password: _, ...userWithoutPassword } = user.toObject();

    return {
      user: userWithoutPassword,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async recoverPassword(recoverPasswordDto: RecoverPasswordDto) {
    const safeResponse = {
      message:
        'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña',
    };

    try {
      const user = await this.userModel.findOne({
        email: recoverPasswordDto.email,
      });

      if (!user) return safeResponse;

      const token = this.jwtService.sign({ id: user.id }, { expiresIn: '15m' });

      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

      const html = recoverPasswordEmailTemplate
        .replaceAll('{{name}}', user.name)
        .replaceAll('{{resetLink}}', resetLink);

      await this.emailService.sendRecoverPasswordEmail(user.email, html);

      return safeResponse;
    } catch (error) {
      handleServiceException(error);
    }
  }

  async verifyDoctor(
    inviteDoctorDto: InviteDoctorDto,
    verificationCode: string,
  ) {
    const user = await this.userModel.findOne({ verificationCode });
    if (
      !user ||
      user.email !== inviteDoctorDto.email ||
      user.role !== inviteDoctorDto.role
    )
      throw new UnauthorizedException('Los datos son incorrectos');
    user.isActive = true;
    user.verificationCode = undefined;
    await user.save();
    return {
      user: user,
      token: this.getJwtToken({ id: user.id }),
    };
  }
}
