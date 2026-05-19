import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ExecutionContext } from '@nestjs/common';
import request from 'supertest';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../auth/guards/user-role.guard';
import { HospitalsController } from './hospitals.controller';
import { HospitalsService } from './hospitals.service';

describe('HospitalsController (Integration)', () => {
  let app: INestApplication;

  const mockHospitalsService = {
    createHospital: jest.fn(),
    inviteDoctor: jest.fn(),
    getDoctors: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [HospitalsController],
      providers: [
        {
          provide: HospitalsService,
          useValue: mockHospitalsService,
        },
      ],
    })
      .overrideGuard(AuthGuard())
      .useValue({
        canActivate: (_context: ExecutionContext) => {
          return true;
        },
      })
      .overrideGuard(UserRoleGuard)
      .useValue({
        canActivate: (_context: ExecutionContext) => {
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/POST hospitals (createHospital)', () => {
    const dto = { name: 'Hospital Central' };
    mockHospitalsService.createHospital.mockResolvedValue({
      ...dto,
      _id: '1',
    });

    return request(app.getHttpServer())
      .post('/hospitals')
      .send(dto)
      .expect(201)
      .expect({ ...dto, _id: '1' });
  });

  it('/POST hospitals/doctors/:doctorId/invite (inviteDoctor)', () => {
    mockHospitalsService.inviteDoctor.mockResolvedValue({ success: true });

    return request(app.getHttpServer())
      .post('/hospitals/doctors/doc1/invite')
      .send({ hospitalId: 'hosp1' })
      .expect(201)
      .expect({ success: true });
  });

  it('/GET hospitals/doctors (getDoctors)', () => {
    mockHospitalsService.getDoctors.mockResolvedValue([]);

    return request(app.getHttpServer())
      .get('/hospitals/doctors')
      .expect(200)
      .expect([]);
  });
});
