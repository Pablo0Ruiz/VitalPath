import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  ForbiddenException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { InviteDoctorDto, LoginUserDto, RegisterDto } from './dto';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  register(@Body() createAuthDto: RegisterDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({
    status: 201,
    description: 'Login successful, returns JWT token',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('login/code/:codigo')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Login with access code' })
  @ApiResponse({
    status: 201,
    description: 'Login successful, returns JWT token',
  })
  @ApiResponse({ status: 401, description: 'Invalid code' })
  loginWithCode(@Param('codigo') codigo: string) {
    return this.authService.loginWithCode(codigo);
  }

  @Post('recover-password')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Send password recovery email' })
  @ApiResponse({ status: 201, description: 'Recovery email sent' })
  @ApiResponse({ status: 404, description: 'User not found' })
  recoverPassword(@Body() recoverPasswordDto: RecoverPasswordDto) {
    return this.authService.recoverPassword(recoverPasswordDto);
  }

  @Patch('set-access-code/:id')
  @Auth()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Set a numeric access code for the authenticated user',
  })
  @ApiResponse({ status: 200, description: 'Access code updated' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — can only update own code',
  })
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
  @ApiOperation({ summary: 'Verify a doctor invite and complete registration' })
  @ApiResponse({ status: 201, description: 'Doctor verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid verification code' })
  verifyDoctor(
    @Body() inviteDoctorDto: InviteDoctorDto,
    @Param('verificationCode') verificationCode: string,
  ) {
    return this.authService.verifyDoctor(inviteDoctorDto, verificationCode);
  }
}
