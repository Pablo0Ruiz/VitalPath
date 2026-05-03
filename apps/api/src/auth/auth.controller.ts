import { Controller, Post, Body, Param, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { InviteDoctorDto, LoginUserDto, RegisterDto } from './dto';
import { RecoverPasswordDto } from './dto/recover-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createAuthDto: RegisterDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('login/code/:codigo')
  loginWithCode(@Param('codigo') codigo: string) {
    return this.authService.loginWithCode(codigo);
  }

  @Post('recover-password')
  recoverPassword(@Body() recoverPasswordDto: RecoverPasswordDto) {
    return this.authService.recoverPassword(recoverPasswordDto);
  }

  @Patch('set-access-code/:id')
  setAccessCode(
    @Param('id') id: string,
    @Body('accessCode') accessCode: string,
  ) {
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
