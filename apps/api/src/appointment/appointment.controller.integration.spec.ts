import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { Types } from 'mongoose';

import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { UserRoleGuard } from 'src/auth/guards/user-role.guard';
import { UserRoles } from 'src/auth/enum/user-role.enum';
import { CitaState } from './dto/enum/cita-state.enum';

const makeId = () => new Types.ObjectId().toString();

// ─── Service mock ─────────────────────────────────────────────────────────────

const mockService = {
  createAppointment: jest.fn(),
  getAppointments: jest.fn().mockResolvedValue([]),
  getAppointmentById: jest.fn(),
  updateAppointment: jest.fn(),
  cancelAppointment: jest.fn().mockResolvedValue(undefined),
  getAppointmentsAdministrator: jest.fn().mockResolvedValue([]),
  getAppointmentsMedico: jest.fn().mockResolvedValue([]),
  updateEstadoWorker: jest.fn(),
};

// ─── App factory ─────────────────────────────────────────────────────────────
// Builds the NestJS app with a mutable activeUser so each test can set its role.

let activeUser: { _id: string; role: UserRoles };

async function buildApp(): Promise<INestApplication> {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [AppointmentController],
    providers: [
      { provide: AppointmentService, useValue: mockService },
      UserRoleGuard,
      Reflector,
    ],
  })
    .overrideGuard(AuthGuard())
    .useValue({
      canActivate: (ctx: ExecutionContext) => {
        ctx.switchToHttp().getRequest().user = activeUser;
        return true;
      },
    })
    .compile();

  const app = module.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  await app.init();
  return app;
}

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('AppointmentController (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await buildApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockService.getAppointments.mockResolvedValue([]);
    mockService.getAppointmentsAdministrator.mockResolvedValue([]);
    mockService.getAppointmentsMedico.mockResolvedValue([]);
    mockService.cancelAppointment.mockResolvedValue(undefined);
  });

  afterAll(() => app.close());

  // ─── GET /appointment — patient's own appointments ────────────────────────

  describe('GET /appointment', () => {
    it('returns 200 and delegates to getAppointments with the user id', async () => {
      const userId = makeId();
      activeUser = { _id: userId, role: UserRoles.PACIENTE };

      await request(app.getHttpServer()).get('/appointment').expect(200);

      expect(mockService.getAppointments).toHaveBeenCalledWith(userId);
    });
  });

  // ─── GET /appointment/allCitas — RBAC enforcement ─────────────────────────

  describe('GET /appointment/allCitas', () => {
    it('returns 403 when role is PACIENTE', async () => {
      activeUser = { _id: makeId(), role: UserRoles.PACIENTE };

      await request(app.getHttpServer())
        .get('/appointment/allCitas')
        .expect(403);
    });

    it('returns 200 when role is TRABAJADOR_CENTRO', async () => {
      activeUser = { _id: makeId(), role: UserRoles.TRABAJADOR_CENTRO };

      await request(app.getHttpServer())
        .get('/appointment/allCitas')
        .expect(200);

      expect(mockService.getAppointmentsAdministrator).toHaveBeenCalled();
    });
  });

  // ─── GET /appointment/allCitasMedico — RBAC enforcement ──────────────────

  describe('GET /appointment/allCitasMedico', () => {
    it('returns 403 when role is PACIENTE', async () => {
      activeUser = { _id: makeId(), role: UserRoles.PACIENTE };

      await request(app.getHttpServer())
        .get('/appointment/allCitasMedico')
        .expect(403);
    });

    it('returns 200 and passes the medico id when role is MEDICO', async () => {
      const userId = makeId();
      activeUser = { _id: userId, role: UserRoles.MEDICO };

      await request(app.getHttpServer())
        .get('/appointment/allCitasMedico')
        .expect(200);

      expect(mockService.getAppointmentsMedico).toHaveBeenCalledWith(userId);
    });
  });

  // ─── POST /appointment ────────────────────────────────────────────────────

  describe('POST /appointment', () => {
    const validBody = {
      medico_ID: new Types.ObjectId().toString(),
      centroSalud_ID: new Types.ObjectId().toString(),
      fecha: '2026-06-01',
      hora: '10:00',
    };

    it('returns 201 and calls createAppointment with user id and dto', async () => {
      const userId = makeId();
      activeUser = { _id: userId, role: UserRoles.PACIENTE };
      mockService.createAppointment.mockResolvedValue({
        _id: makeId(),
        ...validBody,
      });

      await request(app.getHttpServer())
        .post('/appointment')
        .send(validBody)
        .expect(201);

      expect(mockService.createAppointment).toHaveBeenCalledWith(
        userId,
        expect.objectContaining({ medico_ID: validBody.medico_ID }),
      );
    });

    it('returns 400 when required fields are missing', async () => {
      activeUser = { _id: makeId(), role: UserRoles.PACIENTE };

      await request(app.getHttpServer())
        .post('/appointment')
        .send({ hora: '10:00' })
        .expect(400);
    });
  });

  // ─── DELETE /appointment/:id ──────────────────────────────────────────────

  describe('DELETE /appointment/:id', () => {
    it('returns 200 and calls cancelAppointment with user id and cita id', async () => {
      const userId = makeId();
      const citaId = makeId();
      activeUser = { _id: userId, role: UserRoles.PACIENTE };

      await request(app.getHttpServer())
        .delete(`/appointment/${citaId}`)
        .expect(200);

      expect(mockService.cancelAppointment).toHaveBeenCalledWith(
        userId,
        citaId,
      );
    });
  });

  // ─── PATCH /appointment/:id/estado — RBAC enforcement ────────────────────

  describe('PATCH /appointment/:id/estado', () => {
    it('returns 403 when role is PACIENTE', async () => {
      activeUser = { _id: makeId(), role: UserRoles.PACIENTE };

      await request(app.getHttpServer())
        .patch(`/appointment/${makeId()}/estado`)
        .send({ estado: CitaState.ASISTIDA })
        .expect(403);
    });

    it('returns 200 and calls updateEstadoWorker when role is TRABAJADOR_CENTRO', async () => {
      const citaId = makeId();
      activeUser = { _id: makeId(), role: UserRoles.TRABAJADOR_CENTRO };
      mockService.updateEstadoWorker.mockResolvedValue({
        _id: citaId,
        estado: CitaState.ASISTIDA,
      });

      await request(app.getHttpServer())
        .patch(`/appointment/${citaId}/estado`)
        .send({ estado: CitaState.ASISTIDA })
        .expect(200);

      expect(mockService.updateEstadoWorker).toHaveBeenCalledWith(
        citaId,
        CitaState.ASISTIDA,
      );
    });
  });
});
