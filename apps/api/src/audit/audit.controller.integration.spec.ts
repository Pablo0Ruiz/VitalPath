import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  ValidationPipe,
} from '@nestjs/common';
import request from 'supertest';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { UserRoleGuard } from 'src/auth/guards/user-role.guard';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { UserRoles } from 'src/auth/enum/user-role.enum';

// ─── Service mock ─────────────────────────────────────────────────────────────

const mockAuditService = {
  findAll: jest.fn(),
};

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('AuditController (integration)', () => {
  let app: INestApplication;
  let authBehavior: 'admin' | 'non-admin' | 'unauthenticated';

  beforeEach(async () => {
    authBehavior = 'admin';

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditController],
      providers: [
        { provide: AuditService, useValue: mockAuditService },
        Reflector,
        UserRoleGuard,
      ],
    })
      .overrideGuard(AuthGuard())
      .useValue({
        canActivate: (ctx: ExecutionContext) => {
          if (authBehavior === 'unauthenticated') {
            throw new UnauthorizedException();
          }
          if (authBehavior === 'non-admin') {
            throw new ForbiddenException();
          }
          const req = ctx.switchToHttp().getRequest();
          req.user = { _id: 'admin-user', role: UserRoles.ADMIN };
          return true;
        },
      })
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  });

  beforeEach(() => jest.clearAllMocks());

  afterEach(async () => {
    await app.close();
  });

  // ─── 200 — ADMIN ─────────────────────────────────────────────────────────

  it('GET /audit-logs returns 200 and delegates to service.findAll for ADMIN', async () => {
    const logs = [
      {
        _id: '1',
        action: 'VIEW',
        userId: 'u1',
        resourceId: 'r1',
        createdAt: new Date().toISOString(),
      },
    ];
    mockAuditService.findAll.mockResolvedValue(logs);
    authBehavior = 'admin';

    const response = await request(app.getHttpServer())
      .get('/audit-logs')
      .expect(200);

    expect(response.body).toEqual(logs);
    expect(mockAuditService.findAll).toHaveBeenCalledTimes(1);
  });

  // ─── Query params forwarded ────────────────────────────────────────────────

  it('GET /audit-logs forwards query params to service.findAll', async () => {
    mockAuditService.findAll.mockResolvedValue([]);
    authBehavior = 'admin';

    await request(app.getHttpServer())
      .get('/audit-logs?userId=u1&action=VIEW')
      .expect(200);

    expect(mockAuditService.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'u1', action: 'VIEW' }),
    );
  });

  // ─── 401 — unauthenticated ─────────────────────────────────────────────────

  it('GET /audit-logs returns 401 when request is unauthenticated', async () => {
    authBehavior = 'unauthenticated';

    await request(app.getHttpServer()).get('/audit-logs').expect(401);

    expect(mockAuditService.findAll).not.toHaveBeenCalled();
  });

  // ─── 403 — non-admin ──────────────────────────────────────────────────────

  it('GET /audit-logs returns 403 for non-ADMIN role', async () => {
    authBehavior = 'non-admin';

    const response = await request(app.getHttpServer())
      .get('/audit-logs')
      .expect(403);

    expect(response.status).toBe(403);
    expect(mockAuditService.findAll).not.toHaveBeenCalled();
  });

  // ─── 400 — invalid date ───────────────────────────────────────────────────

  it('GET /audit-logs returns 400 when from is not a valid date', async () => {
    authBehavior = 'admin';

    await request(app.getHttpServer())
      .get('/audit-logs?from=not-a-date')
      .expect(400);

    expect(mockAuditService.findAll).not.toHaveBeenCalled();
  });
});
