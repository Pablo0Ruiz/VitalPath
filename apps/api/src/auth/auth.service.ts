import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { MailerService } from '@nestjs-modules/mailer';
import recoverPasswordEmailTemplate from 'src/common/template/recover-password-email.template';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { handleServiceException } from 'src/common/helpers/handle-exceptions.helper';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
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
        ...userWithoutPassword,
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
      ...userWithoutPassword,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async loginWithId(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) throw new UnauthorizedException('El usuario no existe');

    const { password: _, ...userWithoutPassword } = user.toObject();

    return {
      ...userWithoutPassword,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async recoverPassword(recoverPasswordDto: RecoverPasswordDto) {
    console.log(process.env.MAIL_HOST);
    console.log(process.env.MAIL_PORT);
    console.log(process.env.MAIL_USER);
    console.log(process.env.MAIL_PASS);
    const safeResponse = {
      message:
        'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña',
    };

    try {
      const user = await this.userModel.findOne({
        email: recoverPasswordDto.email,
      });

      // Por seguridad: no revelamos si el email está registrado o no
      if (!user) return safeResponse;

      const token = this.jwtService.sign(
        { id: user.id },
        {
          expiresIn: '15m',
        },
      );

      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

      await this.mailService.sendMail({
        to: user.email,
        subject: 'Recuperar contraseña',
        html: recoverPasswordEmailTemplate
          .replaceAll('{{name}}', user.name)
          .replaceAll('{{resetLink}}', resetLink),
      });

      return safeResponse;
    } catch (error) {
      handleServiceException(error);
    }
  }
}
