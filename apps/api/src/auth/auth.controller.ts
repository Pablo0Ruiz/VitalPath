import { Controller, Post, Body, Param } from '@nestjs/common';
import { AuthService, type CreateDtoRegister } from './auth.service';
import { InviteDoctorDto, LoginUserDto } from './dto';
import { ParseMongoIdPipe } from 'src/common/pipe/parse-mongo-id.pipe';
import { RecoverPasswordDto } from './dto/recover-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createAuthDto: CreateDtoRegister) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('login/:id')
  loginWithId(@Param('id', ParseMongoIdPipe) id: string) {
    return this.authService.loginWithId(id);
  }

  @Post('recover-password')
  recoverPassword(@Body() recoverPasswordDto: RecoverPasswordDto) {
    return this.authService.recoverPassword(recoverPasswordDto);
  }

  @Post('verify-doctor/:verificationCode')
  verifyDoctor(
    @Body() inviteDoctorDto: InviteDoctorDto,
    @Param('verificationCode') verificationCode: string,
  ) {
    return this.authService.verifyDoctor(inviteDoctorDto, verificationCode);
  }
}
