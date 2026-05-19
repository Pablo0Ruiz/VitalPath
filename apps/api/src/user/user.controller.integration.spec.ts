import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { Types } from 'mongoose';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRoles } from 'src/auth/enum/user-role.enum';

// ─── Service mock ─────────────────────────────────────────────────────────────

const mockService = {
  getUserProfile: jest.fn(),
  getPatientByIdForStaff: jest.fn(),
  updateProfile: jest.fn(),
  saveExpoPushToken: jest.fn(),
};

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('UserController (integration)', () => {
  let app: INestApplication;
  let activeUser: { _id: string; role: string };

  const buildApp = async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockService }, Reflector],
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
    await app.init();
    return app;
  };

  beforeAll(async () => {
    app = await buildApp();
  });

  beforeEach(() => jest.clearAllMocks());

  afterAll(() => app.close());

  // ─── GET /user/me ─────────────────────────────────────────────────────────

  describe('GET /user/me', () => {
    it('returns 200 and delegates to UserService.getUserProfile with the authenticated user id', async () => {
      const userId = new Types.ObjectId().toString();
      activeUser = { _id: userId, role: UserRoles.PACIENTE };
      const profile = { _id: userId, name: 'Ana', profile: null };
      mockService.getUserProfile.mockResolvedValue(profile);

      const response = await request(app.getHttpServer())
        .get('/user/me')
        .expect(200);

      expect(response.body).toMatchObject({ name: 'Ana' });
      expect(mockService.getUserProfile).toHaveBeenCalledWith(userId);
    });
  });

  // ─── GET /user/patients/:id ───────────────────────────────────────────────

  describe('GET /user/patients/:id', () => {
    const patientId = new Types.ObjectId().toString();
    const patientProfile = { _id: patientId, name: 'Carlos', profile: {} };

    it.each([
      [UserRoles.MEDICO],
      [UserRoles.TRABAJADOR_CENTRO],
      [UserRoles.ADMIN],
    ])('returns 200 for role %s', async role => {
      activeUser = { _id: new Types.ObjectId().toString(), role };
      mockService.getPatientByIdForStaff.mockResolvedValue(patientProfile);

      await request(app.getHttpServer())
        .get(`/user/patients/${patientId}`)
        .expect(200);

      expect(mockService.getPatientByIdForStaff).toHaveBeenCalledWith(
        patientId,
      );
    });

    it.each([[UserRoles.PACIENTE], [UserRoles.CUIDADOR_FAMILIAR]])(
      'returns 403 for role %s',
      async role => {
        activeUser = { _id: new Types.ObjectId().toString(), role };

        await request(app.getHttpServer())
          .get(`/user/patients/${patientId}`)
          .expect(403);
      },
    );

    it('returns 404 when patient is not found', async () => {
      activeUser = {
        _id: new Types.ObjectId().toString(),
        role: UserRoles.MEDICO,
      };
      mockService.getPatientByIdForStaff.mockRejectedValue(
        new NotFoundException('Paciente no encontrado'),
      );

      await request(app.getHttpServer())
        .get(`/user/patients/${patientId}`)
        .expect(404);
    });
  });
});
