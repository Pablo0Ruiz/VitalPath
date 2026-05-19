import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { Types } from 'mongoose';

import { SupabaseController } from './supabase.controller';
import { SupabaseService } from './supabase.service';
import { UserRoles } from 'src/auth/enum/user-role.enum';

// ─── Service mock ─────────────────────────────────────────────────────────────

const mockSupabaseService = {
  uploadFile: jest.fn(),
  updateNotasMedico: jest.fn(),
  getMisResultados: jest.fn(),
  getResultadosPaciente: jest.fn(),
  getAllResumen: jest.fn(),
  getPublicUrl: jest.fn(),
};

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('SupabaseController — GET /storage/resultado/pacientes/:id', () => {
  let app: INestApplication;
  let activeUser: { _id: string; role: string };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupabaseController],
      providers: [
        { provide: SupabaseService, useValue: mockSupabaseService },
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

    app = module.createNestApplication();
    await app.init();
  });

  beforeEach(() => jest.clearAllMocks());

  afterAll(() => app.close());

  const patientId = new Types.ObjectId().toString();

  it('returns 200 for MEDICO caller', async () => {
    activeUser = {
      _id: new Types.ObjectId().toString(),
      role: UserRoles.MEDICO,
    };
    mockSupabaseService.getResultadosPaciente.mockResolvedValue([]);

    const response = await request(app.getHttpServer())
      .get(`/storage/resultado/pacientes/${patientId}`)
      .expect(200);

    expect(response.body).toEqual([]);
    expect(mockSupabaseService.getResultadosPaciente).toHaveBeenCalledWith(
      patientId,
    );
  });

  it('returns 200 for TRABAJADOR_CENTRO caller', async () => {
    activeUser = {
      _id: new Types.ObjectId().toString(),
      role: UserRoles.TRABAJADOR_CENTRO,
    };
    mockSupabaseService.getResultadosPaciente.mockResolvedValue([]);

    await request(app.getHttpServer())
      .get(`/storage/resultado/pacientes/${patientId}`)
      .expect(200);
  });

  it('returns 200 for ADMIN caller', async () => {
    activeUser = {
      _id: new Types.ObjectId().toString(),
      role: UserRoles.ADMIN,
    };
    mockSupabaseService.getResultadosPaciente.mockResolvedValue([]);

    await request(app.getHttpServer())
      .get(`/storage/resultado/pacientes/${patientId}`)
      .expect(200);
  });

  it('returns 403 for PACIENTE caller', async () => {
    activeUser = {
      _id: new Types.ObjectId().toString(),
      role: UserRoles.PACIENTE,
    };

    await request(app.getHttpServer())
      .get(`/storage/resultado/pacientes/${patientId}`)
      .expect(403);
  });

  it('returns 200 with empty array when patient has no results', async () => {
    activeUser = {
      _id: new Types.ObjectId().toString(),
      role: UserRoles.MEDICO,
    };
    mockSupabaseService.getResultadosPaciente.mockResolvedValue([]);

    const response = await request(app.getHttpServer())
      .get(`/storage/resultado/pacientes/${patientId}`)
      .expect(200);

    expect(response.body).toEqual([]);
  });
});
