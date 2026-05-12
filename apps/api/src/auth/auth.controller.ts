import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  ForbiddenException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { InviteDoctorDto, LoginUserDto, RegisterDto } from './dto';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  register(@Body() createAuthDto: RegisterDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('login/code/:codigo')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  loginWithCode(@Param('codigo') codigo: string) {
    return this.authService.loginWithCode(codigo);
  }

  @Post('recover-password')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  recoverPassword(@Body() recoverPasswordDto: RecoverPasswordDto) {
    return this.authService.recoverPassword(recoverPasswordDto);
  }

  @Patch('set-access-code/:id')
  @Auth()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  setAccessCode(
    @Param('id') id: string,
    @Body('accessCode') accessCode: string,
    @GetUser('_id') currentUserId: string,
  ) {
    if (String(currentUserId) !== String(id)) {
      throw new ForbiddenException(
        'No tenés permiso para modificar este código',
      );
    }
    return this.authService.setAccessCode(id, accessCode);
  }

  @Post('verify-doctor/:verificationCode')
  verifyDoctor(
    @Body() inviteDoctorDto: InviteDoctorDto,
    @Param('verificationCode') verificationCode: string,
  ) {
    return this.authService.verifyDoctor(inviteDoctorDto, verificationCode);
  }
}
