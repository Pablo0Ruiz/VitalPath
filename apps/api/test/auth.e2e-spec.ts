import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';

import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { User, UserSchema } from 'src/auth/entities/user.entity';
import { Doctor, DoctorSchema } from 'src/user/entities/doctor.entity';
import { Patient, PatientSchema } from 'src/user/entities/patient.entity';
import {
  CentroSalud,
  CentroSaludSchema,
} from 'src/user/entities/centro-salud.entity';
import { EmailService } from 'src/common/email/email.service';
import { ParseMongoIdPipe } from 'src/common/pipe/parse-mongo-id.pipe';

const JWT_SECRET = 'e2e-test-secret';

const validPatientDto = {
  email: 'patient@example.com',
  password: 'Secret1',
  name: 'Ana',
  lastName: 'García',
  fechaNacimiento: '1990-01-01',
  centroSalud_ID: '',
  genero: 'Femenino',
};

jest.setTimeout(90_000);

describe('Auth (E2E)', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([
          { name: User.name, schema: UserSchema },
          { name: Doctor.name, schema: DoctorSchema },
          { name: Patient.name, schema: PatientSchema },
          { name: CentroSalud.name, schema: CentroSaludSchema },
        ]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: JWT_SECRET,
          signOptions: { expiresIn: '30d' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtStrategy,
        ParseMongoIdPipe,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => (key === 'JWT_SECRET' ? JWT_SECRET : ''),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendRecoverPasswordEmail: jest.fn().mockResolvedValue(undefined),
          },
        },
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

  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
  });

  // ─── POST /auth/register ────────────────────────────────────────────────────

  describe('POST /auth/register', () => {
    it('registers a new patient and returns user + token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(validPatientDto)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user).not.toHaveProperty('password');
      expect(response.body.user.email).toBe(validPatientDto.email);
    });

    it('returns 400 when email is already registered', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(validPatientDto)
        .expect(400);
    });

    it('returns 400 when required fields are missing', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'incomplete@example.com' })
        .expect(400);
    });
  });

  // ─── POST /auth/login ──────────────────────────────────────────────────────

  describe('POST /auth/login', () => {
    it('returns user + token for valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: validPatientDto.email,
          password: validPatientDto.password,
        })
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(validPatientDto.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('returns 401 for a wrong password', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: validPatientDto.email, password: 'WrongPass1' })
        .expect(401);
    });

    it('returns 401 for a non-existent email', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'ghost@example.com', password: 'Secret1' })
        .expect(401);
    });

    it('returns 400 when email field is missing', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ password: 'Secret1' })
        .expect(400);
    });
  });
});
