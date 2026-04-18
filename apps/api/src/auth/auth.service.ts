import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { handleServiceException } from 'src/common/helpers/handle-exceptions.helper';
import { EmailService } from 'src/common/email/email.service';
import recoverPasswordEmailTemplate from 'src/common/template/recover-password-email.template';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = await this.userModel.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

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

  async verifyDoctor(verificationCode: string) {
    const user = await this.userModel.findOne({ verificationCode });
    if (!user) throw new UnauthorizedException('El código es incorrecto');
    user.isActive = true;
    user.verificationCode = undefined;
    await user.save();
    return {
      user: user,
      token: this.getJwtToken({ id: user.id }),
    };
  }
}
