import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRoles } from './enum/user-role.enum';
import { ParseMongoIdPipe } from 'src/common/pipe/parse-mongo-id.pipe';

// ─── Service mock ─────────────────────────────────────────────────────────────

const tokenResponse = {
  user: { id: 'user-id', email: 'u@example.com' },
  token: 'jwt-token',
};

const mockService = {
  create: jest.fn().mockResolvedValue(tokenResponse),
  login: jest.fn().mockResolvedValue(tokenResponse),
  loginWithCode: jest.fn().mockResolvedValue(tokenResponse),
  recoverPassword: jest.fn().mockResolvedValue({ message: 'ok' }),
  verifyDoctor: jest.fn().mockResolvedValue(tokenResponse),
};

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('AuthController (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockService },
        ParseMongoIdPipe,
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  });

  beforeEach(() => jest.clearAllMocks());

  afterAll(() => app.close());

  // ─── POST /auth/register ─────────────────────────────────────────────────

  describe('POST /auth/register', () => {
    const validBody = {
      email: 'new@example.com',
      password: 'Secret1',
      name: 'Ana',
      lastName: 'García',
      fechaNacimiento: '1990-01-01',
    };

    it('returns 201 and delegates to AuthService.create', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(validBody)
        .expect(201);

      expect(response.body).toMatchObject({ token: 'jwt-token' });
      expect(mockService.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'new@example.com' }),
      );
    });

    it('returns 400 when required fields are missing', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'incomplete@example.com' })
        .expect(400);
    });

    it('returns 400 when password fails strength rules', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ ...validBody, password: 'weak' })
        .expect(400);
    });
  });

  // ─── POST /auth/login ─────────────────────────────────────────────────────

  describe('POST /auth/login', () => {
    it('returns 201 and delegates to AuthService.login', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'u@example.com', password: 'Secret1' })
        .expect(201);

      expect(response.body).toMatchObject({ token: 'jwt-token' });
      expect(mockService.login).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'u@example.com' }),
      );
    });

    it('returns 400 when email is missing', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ password: 'Secret1' })
        .expect(400);
    });

    it('returns 400 when password is missing', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'u@example.com' })
        .expect(400);
    });
  });

  // ─── POST /auth/recover-password ──────────────────────────────────────────

  describe('POST /auth/recover-password', () => {
    it('returns 201 and delegates to AuthService.recoverPassword', async () => {
      await request(app.getHttpServer())
        .post('/auth/recover-password')
        .send({ email: 'u@example.com' })
        .expect(201);

      expect(mockService.recoverPassword).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'u@example.com' }),
      );
    });

    it('returns 400 when email is not a valid email', async () => {
      await request(app.getHttpServer())
        .post('/auth/recover-password')
        .send({ email: 'not-an-email' })
        .expect(400);
    });
  });

  // ─── POST /auth/login/code/:codigo ───────────────────────────────────────
  describe('POST /auth/login/code/:codigo', () => {
    it('returns 201 and delegates to AuthService.loginWithCode', async () => {
      const code = 'SENIOR123';

      await request(app.getHttpServer())
        .post(`/auth/login/code/${code}`)
        .expect(201);

      expect(mockService.loginWithCode).toHaveBeenCalledWith(code);
    });
  });

  // ─── POST /auth/verify-doctor/:code ───────────────────────────────────────

  describe('POST /auth/verify-doctor/:verificationCode', () => {
    it('returns 201 and delegates to AuthService.verifyDoctor', async () => {
      const code = 'VERIFY123';

      await request(app.getHttpServer())
        .post(`/auth/verify-doctor/${code}`)
        .send({ email: 'doc@example.com', role: UserRoles.MEDICO })
        .expect(201);

      expect(mockService.verifyDoctor).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'doc@example.com' }),
        code,
      );
    });
  });
});
