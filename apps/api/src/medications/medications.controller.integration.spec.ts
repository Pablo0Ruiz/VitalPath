import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import request from 'supertest';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';
import { MedicationsController } from './medications.controller';
import { MedicationsService } from './medications.service';
import { UserRoles } from 'src/auth/enum/user-role.enum';

describe('MedicationsController (Integration)', () => {
  let app: INestApplication;
  let activeUser = { _id: 'user123', role: UserRoles.PACIENTE };

  const mockMedicationsService = {
    createMedication: jest.fn(),
    findAllMedications: jest.fn(),
    findOneMedication: jest.fn(),
    findActiveByPatient: jest.fn(),
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
          req.user = activeUser;
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(() => jest.clearAllMocks());

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

  // ─── GET /medications/patient/:id ─────────────────────────────────────────

  describe('GET /medications/patient/:id', () => {
    const patientId = new Types.ObjectId().toString();
    const meds = [{ _id: '1', name: 'Ibuprofeno' }];

    it('returns 200 for MEDICO caller', async () => {
      activeUser = {
        _id: new Types.ObjectId().toString(),
        role: UserRoles.MEDICO,
      };
      mockMedicationsService.findActiveByPatient.mockResolvedValue(meds);

      const response = await request(app.getHttpServer())
        .get(`/medications/patient/${patientId}`)
        .expect(200);

      expect(response.body).toEqual(meds);
      expect(mockMedicationsService.findActiveByPatient).toHaveBeenCalledWith(
        patientId,
        activeUser,
      );
    });

    it('returns 200 for PACIENTE accessing own id', async () => {
      activeUser = { _id: patientId, role: UserRoles.PACIENTE };
      mockMedicationsService.findActiveByPatient.mockResolvedValue(meds);

      const response = await request(app.getHttpServer())
        .get(`/medications/patient/${patientId}`)
        .expect(200);

      expect(response.body).toEqual(meds);
    });

    it('returns 403 when service throws ForbiddenException (PACIENTE other id)', async () => {
      activeUser = {
        _id: new Types.ObjectId().toString(),
        role: UserRoles.PACIENTE,
      };
      mockMedicationsService.findActiveByPatient.mockRejectedValue(
        new ForbiddenException('No tienes permiso'),
      );

      await request(app.getHttpServer())
        .get(`/medications/patient/${patientId}`)
        .expect(403);
    });
  });
});
