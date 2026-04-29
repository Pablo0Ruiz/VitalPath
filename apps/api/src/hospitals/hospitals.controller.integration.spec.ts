import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import request from 'supertest';
import { Types } from 'mongoose';

import { HospitalsController } from './hospitals.controller';
import { HospitalsService } from './hospitals.service';

// ─── Service mock ─────────────────────────────────────────────────────────────

const mockService = {
  createHospital: jest.fn(),
  getCentrosSalud: jest.fn().mockResolvedValue([]),
  inviteDoctor: jest.fn(),
  getDoctors: jest.fn().mockResolvedValue([]),
};

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('HospitalsController (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HospitalsController],
      providers: [{ provide: HospitalsService, useValue: mockService }],
    })
      .overrideGuard(AuthGuard())
      .useValue({
        canActivate: (ctx: ExecutionContext) => {
          ctx.switchToHttp().getRequest().user = {
            _id: new Types.ObjectId().toString(),
          };
          return true;
        },
      })
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  beforeEach(() => jest.clearAllMocks());

  afterAll(() => app.close());

  // ─── POST /hospitals ──────────────────────────────────────────────────────

  describe('POST /hospitals', () => {
    it('returns 201 and delegates to HospitalsService.createHospital', async () => {
      const hospital = {
        nombre: 'H1',
        direccion: 'Calle 1',
        codigoVinculacion: 'CODE-X',
      };
      mockService.createHospital.mockResolvedValue(hospital);

      await request(app.getHttpServer())
        .post('/hospitals')
        .send({ nombre: 'H1', direccion: 'Calle 1' })
        .expect(201);

      expect(mockService.createHospital).toHaveBeenCalledWith(
        expect.objectContaining({ nombre: 'H1' }),
      );
    });

    it('returns 400 when required fields are missing', async () => {
      await request(app.getHttpServer())
        .post('/hospitals')
        .send({ nombre: 'H1' })
        .expect(400);
    });
  });

  // ─── POST /hospitals/doctors/:doctorId/invite ─────────────────────────────

  describe('POST /hospitals/doctors/:doctorId/invite', () => {
    it('returns 201 and delegates to HospitalsService.inviteDoctor', async () => {
      const doctorId = new Types.ObjectId().toString();
      mockService.inviteDoctor.mockResolvedValue({
        message: 'Invitación enviada exitosamente',
      });

      await request(app.getHttpServer())
        .post(`/hospitals/doctors/${doctorId}/invite`)
        .expect(201);

      expect(mockService.inviteDoctor).toHaveBeenCalledWith(
        doctorId,
        undefined,
      );
    });
  });

  // ─── GET /hospitals/doctors ───────────────────────────────────────────────

  describe('GET /hospitals/doctors', () => {
    it('returns 200 and delegates to HospitalsService.getDoctors', async () => {
      await request(app.getHttpServer()).get('/hospitals/doctors').expect(200);

      expect(mockService.getDoctors).toHaveBeenCalled();
    });
  });
});
