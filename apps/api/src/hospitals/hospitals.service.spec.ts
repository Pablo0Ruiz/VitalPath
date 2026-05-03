import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { HospitalsService } from './hospitals.service';
import { User } from '../auth/entities/user.entity';
import { Doctor } from '../user/entities/doctor.entity';
import {
  CentroSalud,
  HospitalType,
} from '../user/entities/centro-salud.entity';

// ─── Model factories ──────────────────────────────────────────────────────────

const makeUserModel = () => ({
  findByIdAndUpdate: jest.fn(),
  countDocuments: jest.fn(),
});

const makeDoctorModel = () => ({
  findById: jest.fn(),
  find: jest.fn(),
});

const makeSelectQuery = (resolved: unknown) => ({
  select: jest.fn().mockReturnValue(Promise.resolve(resolved)),
});

const makePopulatable = (resolved: unknown) => ({
  populate: jest.fn().mockReturnThis(),
  then<TResult1 = unknown, TResult2 = never>(
    onFulfilled?: ((value: unknown) => TResult1 | PromiseLike<TResult1>) | null,
    onRejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return Promise.resolve(resolved).then(onFulfilled, onRejected);
  },
});

const makeCentroModel = () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
});

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('HospitalsService', () => {
  let service: HospitalsService;
  let userModel: ReturnType<typeof makeUserModel>;
  let doctorModel: ReturnType<typeof makeDoctorModel>;
  let centroModel: ReturnType<typeof makeCentroModel>;

  beforeEach(async () => {
    userModel = makeUserModel();
    doctorModel = makeDoctorModel();
    centroModel = makeCentroModel();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HospitalsService,
        { provide: getModelToken(User.name), useValue: userModel },
        { provide: getModelToken(Doctor.name), useValue: doctorModel },
        { provide: getModelToken(CentroSalud.name), useValue: centroModel },
      ],
    }).compile();

    service = module.get(HospitalsService);
  });

  // ─── createHospital ───────────────────────────────────────────────────────

  describe('createHospital', () => {
    it('creates a hospital with the given codigoVinculacion when provided', async () => {
      const dto = {
        nombre: 'H1',
        direccion: 'Calle 1',
        codigoVinculacion: 'CODE-X',
      };
      centroModel.create.mockResolvedValue({ ...dto });

      await service.createHospital(dto);

      expect(centroModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ codigoVinculacion: 'CODE-X' }),
      );
    });

    it('generates a codigoVinculacion when not provided', async () => {
      const dto = { nombre: 'H2', direccion: 'Calle 2' };
      centroModel.create.mockResolvedValue({});

      await service.createHospital(dto);

      const createArg = centroModel.create.mock.calls[0][0] as {
        codigoVinculacion: string;
      };
      expect(createArg.codigoVinculacion).toMatch(/^GEN-/);
    });

    it('uses GENERAL as default tipo when not provided', async () => {
      centroModel.create.mockResolvedValue({});

      await service.createHospital({ nombre: 'H3', direccion: 'Calle 3' });

      expect(centroModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ tipo: HospitalType.GENERAL }),
      );
    });
  });

  // ─── getCentrosSalud ──────────────────────────────────────────────────────

  describe('getCentrosSalud', () => {
    it('delegates to centroSaludModel.find with a select projection', async () => {
      const hospitals = [{ nombre: 'H1' }];
      centroModel.find.mockReturnValue(makeSelectQuery(hospitals));

      const result = await service.getCentrosSalud();

      expect(result).toBe(hospitals);
      expect(centroModel.find).toHaveBeenCalled();
    });
  });

  // ─── inviteDoctor ─────────────────────────────────────────────────────────

  describe('inviteDoctor', () => {
    const doctorId = new Types.ObjectId().toString();
    const hospitalId = new Types.ObjectId().toString();

    it('throws NotFoundException when the doctor does not exist', async () => {
      doctorModel.findById.mockResolvedValue(null);

      await expect(service.inviteDoctor(doctorId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('uses the specified hospitalId when provided', async () => {
      const doctor = { _id: doctorId, user: new Types.ObjectId() };
      const hospital = {
        _id: hospitalId,
        codigoVinculacion: 'CODE-H',
        nombre: 'H1',
      };
      const updatedUser = { _id: doctor.user };

      doctorModel.findById.mockResolvedValue(doctor);
      centroModel.findById.mockResolvedValue(hospital);
      userModel.findByIdAndUpdate.mockResolvedValue(updatedUser);

      const result = await service.inviteDoctor(doctorId, hospitalId);

      expect(centroModel.findById).toHaveBeenCalledWith(hospitalId);
      expect(result.hospital.codigoVinculacion).toBe('CODE-H');
    });

    it('picks the hospital with the lowest weight when hospitalId is omitted', async () => {
      const doctor = { _id: doctorId, user: new Types.ObjectId() };
      const hospitalHeavy = {
        _id: new Types.ObjectId(),
        codigoVinculacion: 'HEAVY',
        nombre: 'Heavy',
        listaMedicos_ID: [1, 2, 3],
      };
      const hospitalLight = {
        _id: new Types.ObjectId(),
        codigoVinculacion: 'LIGHT',
        nombre: 'Light',
        listaMedicos_ID: [],
      };

      doctorModel.findById.mockResolvedValue(doctor);
      centroModel.find.mockResolvedValue([hospitalHeavy, hospitalLight]);
      userModel.countDocuments
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(0);
      userModel.findByIdAndUpdate.mockResolvedValue({});

      const result = await service.inviteDoctor(doctorId);

      expect(result.hospital.codigoVinculacion).toBe('LIGHT');
    });
  });

  // ─── getDoctors ───────────────────────────────────────────────────────────

  describe('getDoctors', () => {
    it('delegates to doctorModel.find with nested populate', async () => {
      const doctors = [{ _id: new Types.ObjectId() }];
      doctorModel.find.mockReturnValue(makePopulatable(doctors));

      const result = await service.getDoctors();

      expect(result).toBe(doctors);
      expect(doctorModel.find).toHaveBeenCalled();
    });
  });
});
