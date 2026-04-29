import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ExecutionContext } from '@nestjs/common';
import request from 'supertest';
import { AuthGuard } from '@nestjs/passport';
import { MedicationsController } from './medications.controller';
import { MedicationsService } from './medications.service';
import { UserRoles } from 'src/auth/enum/user-role.enum';

describe('MedicationsController (Integration)', () => {
  let app: INestApplication;

  const mockUser = { _id: 'user123', role: UserRoles.PACIENTE };

  const mockMedicationsService = {
    createMedication: jest.fn(),
    findAllMedications: jest.fn(),
    findOneMedication: jest.fn(),
    updateMedication: jest.fn(),
    removeMedication: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [MedicationsController],
      providers: [
        {
          provide: MedicationsService,
          useValue: mockMedicationsService,
        },
      ],
    })
      .overrideGuard(AuthGuard())
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = mockUser;
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

  it('/POST medications (create)', () => {
    const dto = { name: 'Ibuprofeno', dose: '400mg' };
    mockMedicationsService.createMedication.mockResolvedValue({
      ...dto,
      _id: '1',
    });

    return request(app.getHttpServer())
      .post('/medications')
      .send(dto)
      .expect(201)
      .expect({ ...dto, _id: '1' });
  });

  it('/GET medications (findAll)', () => {
    mockMedicationsService.findAllMedications.mockResolvedValue([]);

    return request(app.getHttpServer())
      .get('/medications')
      .expect(200)
      .expect([]);
  });

  it('/GET medications/:id (findOne)', () => {
    mockMedicationsService.findOneMedication.mockResolvedValue({ name: 'Ibu' });

    return request(app.getHttpServer())
      .get('/medications/1')
      .expect(200)
      .expect({ name: 'Ibu' });
  });

  it('/PATCH medications/:id (update)', () => {
    mockMedicationsService.updateMedication.mockResolvedValue({
      success: true,
    });

    return request(app.getHttpServer())
      .patch('/medications/1')
      .send({ name: 'Ibu updated' })
      .expect(200)
      .expect({ success: true });
  });

  it('/DELETE medications/:id (remove)', () => {
    mockMedicationsService.removeMedication.mockResolvedValue({
      deleted: true,
    });

    return request(app.getHttpServer())
      .delete('/medications/1')
      .expect(200)
      .expect({ deleted: true });
  });
});
