import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { InviteDoctorDto, LoginUserDto, RegisterDto } from './dto';
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
import { CentroSalud } from 'src/user/entities/centro-salud.entity';

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
    @InjectModel(CentroSalud.name)
    private readonly centroSaludModel: Model<CentroSalud>,
  ) {}

  async create(createUserDto: RegisterDto) {
    try {
      const { password, ...userData } = createUserDto;

      if (!userData.role) {
        userData.role = UserRoles.PACIENTE;
      }

      const user = await this.userModel.create({
        ...userData,
        password: bcrypt.hashSync(password, 12),
      });

      if (user.role === UserRoles.PACIENTE) {
        await this.patientModel.create({
          user: user._id,
          medications: userData.medications ?? [],
        });
      } else if (user.role === UserRoles.MEDICO) {
        await this.doctorModel.create({
          user: user._id,
          especialidad: userData.especialidad ?? Especialidad.MEDICINA_GENERAL,
          slots: userData.slots ?? [],
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

  async loginWithCode(codigo: string) {
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - 65);

    const user = await this.userModel.findOne({
      accessCode: codigo,
      fechaNacimiento: { $lte: cutoff },
    });

    if (!user)
      throw new UnauthorizedException('Código inválido o acceso no autorizado');

    const { password: _, ...userWithoutPassword } = user.toObject();

    return {
      user: userWithoutPassword,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async setAccessCode(id: string, accessCode: string) {
    try {
      const user = await this.userModel.findByIdAndUpdate(
        id,
        { accessCode },
        { returnDocument: 'after' },
      );

      if (!user) throw new UnauthorizedException('Usuario no encontrado');

      return {
        message: 'Código de acceso actualizado correctamente',
        user: {
          id: user.id,
          name: user.name,
          accessCode: user.accessCode,
        },
      };
    } catch (error) {
      handleServiceException(error);
    }
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
    const user = await this.userModel.findOne({
      verificationCode,
      email: inviteDoctorDto.email,
    });
    const centroSalud = await this.centroSaludModel.findOne({
      codigoVinculacion: verificationCode,
    });

    if (!centroSalud)
      throw new UnauthorizedException('El código de vinculación no es válido');

    if (
      !user ||
      user.email !== inviteDoctorDto.email ||
      user.role !== inviteDoctorDto.role
    ) {
      throw new UnauthorizedException('Los datos son incorrectos');
    }

    user.isActive = true;
    user.verificationCode = undefined;
    user.centroSalud_ID = centroSalud._id as Types.ObjectId;
    centroSalud.listaMedicos_ID.push(user._id);
    centroSalud.listaTrabajadores_ID.push(user._id);
    await user.save();
    await centroSalud.save();
    return {
      user: user,
      token: this.getJwtToken({ id: user.id }),
    };
  }
}
