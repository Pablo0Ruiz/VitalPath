import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import request from 'supertest';
import { Types } from 'mongoose';

import { UserController } from './user.controller';
import { UserService } from './user.service';

// ─── Service mock ─────────────────────────────────────────────────────────────

const mockService = {
  getUserProfile: jest.fn(),
};

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('UserController (integration)', () => {
  let app: INestApplication;
  let activeUserId: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockService }],
    })
      .overrideGuard(AuthGuard())
      .useValue({
        canActivate: (ctx: ExecutionContext) => {
          ctx.switchToHttp().getRequest().user = { _id: activeUserId };
          return true;
        },
      })
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  beforeEach(() => jest.clearAllMocks());

  afterAll(() => app.close());

  // ─── GET /user/me ─────────────────────────────────────────────────────────

  describe('GET /user/me', () => {
    it('returns 200 and delegates to UserService.getUserProfile with the authenticated user id', async () => {
      activeUserId = new Types.ObjectId().toString();
      const profile = { _id: activeUserId, name: 'Ana', profile: null };
      mockService.getUserProfile.mockResolvedValue(profile);

      const response = await request(app.getHttpServer())
        .get('/user/me')
        .expect(200);

      expect(response.body).toMatchObject({ name: 'Ana' });
      expect(mockService.getUserProfile).toHaveBeenCalledWith(activeUserId);
    });
  });
});
