import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  ForbiddenException,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { type Request, type Response } from 'express';
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

  // ─── Private helpers ────────────────────────────────────────────────────────

  private setRefreshCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: true, // always secure — Koyeb (API) + Render (web) are both HTTPS
      sameSite: 'none', // cross-domain: Koyeb (API) ≠ Render (web) → SameSite=None required
      path: '/api/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });
  }

  private clearRefreshCookie(res: Response) {
    res.clearCookie('refresh_token', { path: '/api/auth' });
  }

  // ─── Endpoints ──────────────────────────────────────────────────────────────

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async register(
    @Body() createAuthDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.create(createAuthDto);
    if (result?.refreshTokenRaw) {
      this.setRefreshCookie(res, result.refreshTokenRaw);
    }
    const { refreshTokenRaw: _, ...response } = result ?? {};
    return response;
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({
    status: 201,
    description: 'Login successful, returns JWT token',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshTokenRaw, ...response } =
      await this.authService.login(loginUserDto);
    this.setRefreshCookie(res, refreshTokenRaw);
    return response;
  }

  @Post('login/code/:codigo')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Login with access code' })
  @ApiResponse({
    status: 201,
    description: 'Login successful, returns JWT token',
  })
  @ApiResponse({ status: 401, description: 'Invalid code' })
  async loginWithCode(
    @Param('codigo') codigo: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshTokenRaw, ...response } =
      await this.authService.loginWithCode(codigo);
    this.setRefreshCookie(res, refreshTokenRaw);
    return response;
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
  async verifyDoctor(
    @Body() inviteDoctorDto: InviteDoctorDto,
    @Param('verificationCode') verificationCode: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshTokenRaw, ...response } =
      await this.authService.verifyDoctor(inviteDoctorDto, verificationCode);
    this.setRefreshCookie(res, refreshTokenRaw);
    return response;
  }

  @Post('refresh')
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiOperation({
    summary: 'Rotate access + refresh tokens using the httpOnly refresh cookie',
  })
  @ApiResponse({ status: 201, description: 'New access token issued' })
  @ApiResponse({ status: 401, description: 'Invalid or missing refresh token' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const raw = req.cookies?.refresh_token as string | undefined;
    if (!raw) throw new UnauthorizedException('No refresh cookie');
    const { accessToken, refreshTokenRaw } =
      await this.authService.rotateRefreshToken(raw);
    this.setRefreshCookie(res, refreshTokenRaw);
    return { accessToken };
  }

  @Post('logout')
  @Auth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Revoke server-side session and clear refresh cookie',
  })
  @ApiResponse({ status: 201, description: 'Logged out successfully' })
  async logout(
    @GetUser('_id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.revokeRefreshToken(String(userId));
    this.clearRefreshCookie(res);
    return { ok: true };
  }
}
