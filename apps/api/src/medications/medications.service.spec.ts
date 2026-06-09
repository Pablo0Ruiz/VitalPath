import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { MedicationsService } from './medications.service';
import { Medication } from './entities/medication.entity';
import { Patient } from 'src/user/entities/patient.entity';
import { UserService } from 'src/user/user.service';
import { UserRoles } from 'src/auth/enum/user-role.enum';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';

const makeId = () => new Types.ObjectId();

// ─── Mock interfaces ──────────────────────────────────────────────────────────

interface MedDoc {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  startTime?: string;
  frequencyHours?: number;
  durationDays?: number;
  dosesTaken?: number;
  notificationIds?: string[];
  save?: jest.Mock;
}

interface ProfileResult {
  profile: {
    medications: Array<{ _id: Types.ObjectId }>;
  } | null;
}

// ─── Factories ────────────────────────────────────────────────────────────────

const makeProfile = (medicationIds: Types.ObjectId[] = []): ProfileResult => ({
  profile: {
    medications: medicationIds.map(id => ({ _id: id })),
  },
});

const makeMedicationModel = () => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
});

const makePatientModel = () => ({
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn().mockResolvedValue(null),
});

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('MedicationsService', () => {
  let service: MedicationsService;
  let medicationModel: ReturnType<typeof makeMedicationModel>;
  let patientModel: ReturnType<typeof makePatientModel>;
  let userService: { getUserProfile: jest.Mock };

  beforeEach(async () => {
    medicationModel = makeMedicationModel();
    patientModel = makePatientModel();
    userService = { getUserProfile: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicationsService,
        { provide: getModelToken(Medication.name), useValue: medicationModel },
        { provide: getModelToken(Patient.name), useValue: patientModel },
        { provide: UserService, useValue: userService },
      ],
    }).compile();

    service = module.get<MedicationsService>(MedicationsService);
  });

  // ─── createMedication ─────────────────────────────────────────────────────

  describe('createMedication', () => {
    it('creates the medication and pushes it to the patient profile', async () => {
      const userId = makeId().toString();
      const medId = makeId();
      const medication: MedDoc = { _id: medId, name: 'Ibuprofeno' };
      medicationModel.create.mockResolvedValue(medication);

      const dto: CreateMedicationDto = { name: 'Ibuprofeno', description: '' };
      const result = await service.createMedication(dto, userId);

      expect(result.medication).toBe(medication);
      expect(result.message).toBe('Medicamento añadido exitosamente');
      expect(patientModel.findOneAndUpdate).toHaveBeenCalledWith(
        { user: userId },
        { $push: { medications: medId } },
      );
    });
  });

  // ─── findAllMedications ───────────────────────────────────────────────────

  describe('findAllMedications', () => {
    it('throws NotFoundException when the patient profile is not found', async () => {
      userService.getUserProfile.mockResolvedValue({
        profile: null,
      } satisfies ProfileResult);

      await expect(
        service.findAllMedications(makeId().toString()),
      ).rejects.toThrow(NotFoundException);
    });

    it('returns the medications from the patient profile', async () => {
      const med = { _id: makeId(), name: 'Paracetamol', description: '' };
      userService.getUserProfile.mockResolvedValue({
        profile: { medications: [med] },
      } satisfies ProfileResult);

      const result = await service.findAllMedications(makeId().toString());

      expect(result).toContain(med);
    });
  });

  // ─── findOneMedication ────────────────────────────────────────────────────

  describe('findOneMedication', () => {
    it('throws ForbiddenException when the medication does not belong to the patient', async () => {
      userService.getUserProfile.mockResolvedValue(makeProfile([makeId()]));

      const foreignId = makeId();
      await expect(
        service.findOneMedication(makeId().toString(), foreignId.toString()),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws NotFoundException when the medication is not found in the DB', async () => {
      const medId = makeId();
      userService.getUserProfile.mockResolvedValue(makeProfile([medId]));
      medicationModel.findById.mockResolvedValue(null);

      await expect(
        service.findOneMedication(makeId().toString(), medId.toString()),
      ).rejects.toThrow(NotFoundException);
    });

    it('returns the medication when found and ownership is verified', async () => {
      const medId = makeId();
      const medication: MedDoc = { _id: medId, name: 'Amoxicilina' };
      userService.getUserProfile.mockResolvedValue(makeProfile([medId]));
      medicationModel.findById.mockResolvedValue(medication);

      const result = await service.findOneMedication(
        makeId().toString(),
        medId.toString(),
      );

      expect(result).toBe(medication);
    });
  });

  // ─── updateMedication ─────────────────────────────────────────────────────

  describe('updateMedication', () => {
    it('throws NotFoundException when the update returns null', async () => {
      const medId = makeId();
      userService.getUserProfile.mockResolvedValue(makeProfile([medId]));
      medicationModel.findByIdAndUpdate.mockResolvedValue(null);

      const dto: UpdateMedicationDto = { name: 'Ibuprofeno' };
      await expect(
        service.updateMedication(makeId().toString(), medId.toString(), dto),
      ).rejects.toThrow(NotFoundException);
    });

    it('returns the updated medication and a success message', async () => {
      const medId = makeId();
      const updated: MedDoc = { _id: medId, name: 'Ibuprofeno 800mg' };
      userService.getUserProfile.mockResolvedValue(makeProfile([medId]));
      medicationModel.findByIdAndUpdate.mockResolvedValue(updated);

      const dto: UpdateMedicationDto = { name: 'Ibuprofeno 800mg' };
      const result = await service.updateMedication(
        makeId().toString(),
        medId.toString(),
        dto,
      );

      expect(result.medication).toBe(updated);
      expect(result.message).toBe('Medicamento actualizado exitosamente');
    });
  });

  // ─── findActiveByPatient ──────────────────────────────────────────────────

  describe('findActiveByPatient', () => {
    const patientId = makeId().toString();
    const staffCaller = { _id: makeId().toString(), role: UserRoles.MEDICO };
    const ownerCaller = { _id: patientId, role: UserRoles.PACIENTE };
    const otherPatientCaller = {
      _id: makeId().toString(),
      role: UserRoles.PACIENTE,
    };

    const makeFindOneChain = (result: unknown) => ({
      populate: jest.fn().mockResolvedValue(result),
    });

    it('allows staff to see another patient medications (200)', async () => {
      const med = { _id: makeId(), name: 'Ibuprofeno' };
      patientModel.findOne.mockReturnValue(
        makeFindOneChain({ medications: [med] }),
      );

      const result = await service.findActiveByPatient(patientId, staffCaller);

      expect(result).toEqual([med]);
      expect(patientModel.findOne).toHaveBeenCalledWith({ user: patientId });
    });

    it('allows the owner patient to see their own medications (200)', async () => {
      const med = { _id: makeId(), name: 'Paracetamol' };
      patientModel.findOne.mockReturnValue(
        makeFindOneChain({ medications: [med] }),
      );

      const result = await service.findActiveByPatient(patientId, ownerCaller);

      expect(result).toEqual([med]);
    });

    it('throws ForbiddenException when a non-owner patient accesses another patient', async () => {
      await expect(
        service.findActiveByPatient(patientId, otherPatientCaller),
      ).rejects.toThrow(ForbiddenException);
      expect(patientModel.findOne).not.toHaveBeenCalled();
    });

    it('returns empty array when patient has no profile', async () => {
      patientModel.findOne.mockReturnValue(makeFindOneChain(null));

      const result = await service.findActiveByPatient(patientId, staffCaller);

      expect(result).toEqual([]);
    });
  });

  // ─── takeMedication ───────────────────────────────────────────────────────

  describe('takeMedication', () => {
    it('increments dosesTaken and returns completed:false without deleting when durationDays is null (indefinite)', async () => {
      const medId = makeId();
      const userId = makeId().toString();
      const saveMock = jest.fn().mockResolvedValue(undefined);
      const medication: MedDoc = {
        _id: medId,
        name: 'Ibuprofeno',
        durationDays: undefined,
        frequencyHours: 24,
        dosesTaken: 0,
        notificationIds: [],
        save: saveMock,
      };
      userService.getUserProfile.mockResolvedValue(makeProfile([medId]));
      medicationModel.findById.mockResolvedValue(medication);

      const result = await service.takeMedication(userId, medId.toString());

      expect(result.completed).toBe(false);
      expect(result.medication).toBeDefined();
      expect(medication.dosesTaken).toBe(1);
      expect(saveMock).toHaveBeenCalled();
      expect(medicationModel.findByIdAndDelete).not.toHaveBeenCalled();
      expect(patientModel.findOneAndUpdate).not.toHaveBeenCalled();
    });

    it('increments dosesTaken and returns completed:false when mid-course (frequencyHours=8)', async () => {
      const medId = makeId();
      const userId = makeId().toString();
      // durationDays=5, frequencyHours=8 → totalDoses = 5 * 24/8 = 15
      const saveMock = jest.fn().mockResolvedValue(undefined);
      const medication: MedDoc = {
        _id: medId,
        name: 'Amoxicilina',
        durationDays: 5,
        frequencyHours: 8,
        dosesTaken: 7,
        notificationIds: [],
        save: saveMock,
      };
      userService.getUserProfile.mockResolvedValue(makeProfile([medId]));
      medicationModel.findById.mockResolvedValue(medication);

      const result = await service.takeMedication(userId, medId.toString());

      expect(result.completed).toBe(false);
      expect(result.medication).toBeDefined();
      expect(medication.dosesTaken).toBe(8);
      expect(saveMock).toHaveBeenCalled();
      expect(medicationModel.findByIdAndDelete).not.toHaveBeenCalled();
    });

    it('deletes and returns completed:true when last dose is taken (frequencyHours=8, dosesTaken=14)', async () => {
      const medId = makeId();
      const userId = makeId().toString();
      // totalDoses = 5 * 24/8 = 15; dosesTaken=14 → after increment → 15 >= 15 → delete
      const saveMock = jest.fn();
      const medication: MedDoc = {
        _id: medId,
        name: 'Amoxicilina',
        durationDays: 5,
        frequencyHours: 8,
        dosesTaken: 14,
        notificationIds: ['n3'],
        save: saveMock,
      };
      userService.getUserProfile.mockResolvedValue(makeProfile([medId]));
      medicationModel.findById.mockResolvedValue(medication);
      medicationModel.findByIdAndDelete.mockResolvedValue(medication);

      const result = await service.takeMedication(userId, medId.toString());

      expect(result.completed).toBe(true);
      expect(result.medication).toBeUndefined();
      expect(medicationModel.findByIdAndDelete).toHaveBeenCalledWith(
        medId.toString(),
      );
    });

    it('throws NotFoundException when medication is not found in DB', async () => {
      const medId = makeId();
      const userId = makeId().toString();
      userService.getUserProfile.mockResolvedValue(makeProfile([medId]));
      medicationModel.findById.mockResolvedValue(null);

      await expect(
        service.takeMedication(userId, medId.toString()),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when medication does not belong to the user', async () => {
      const medId = makeId();
      const userId = makeId().toString();
      // profile has a different medication id
      userService.getUserProfile.mockResolvedValue(makeProfile([makeId()]));

      await expect(
        service.takeMedication(userId, medId.toString()),
      ).rejects.toThrow(ForbiddenException);
    });

    it('increments dosesTaken and returns completed:false when mid-course (frequencyHours=6)', async () => {
      const medId = makeId();
      const userId = makeId().toString();
      // durationDays=2, frequencyHours=6 → totalDoses = 2 * 24/6 = 8
      const saveMock = jest.fn().mockResolvedValue(undefined);
      const medication: MedDoc = {
        _id: medId,
        name: 'Paracetamol',
        durationDays: 2,
        frequencyHours: 6,
        dosesTaken: 3,
        notificationIds: [],
        save: saveMock,
      };
      userService.getUserProfile.mockResolvedValue(makeProfile([medId]));
      medicationModel.findById.mockResolvedValue(medication);

      const result = await service.takeMedication(userId, medId.toString());

      expect(result.completed).toBe(false);
      expect(medication.dosesTaken).toBe(4);
      expect(saveMock).toHaveBeenCalled();
    });

    it('deletes and returns completed:true when last dose is taken (frequencyHours=12)', async () => {
      const medId = makeId();
      const userId = makeId().toString();
      // durationDays=3, frequencyHours=12 → totalDoses = 3 * 24/12 = 6; dosesTaken=5
      const saveMock = jest.fn();
      const medication: MedDoc = {
        _id: medId,
        name: 'Dexametasona',
        durationDays: 3,
        frequencyHours: 12,
        dosesTaken: 5,
        notificationIds: [],
        save: saveMock,
      };
      userService.getUserProfile.mockResolvedValue(makeProfile([medId]));
      medicationModel.findById.mockResolvedValue(medication);
      medicationModel.findByIdAndDelete.mockResolvedValue(medication);

      const result = await service.takeMedication(userId, medId.toString());

      expect(result.completed).toBe(true);
      expect(medicationModel.findByIdAndDelete).toHaveBeenCalledWith(
        medId.toString(),
      );
    });

    it('deletes and returns completed:true when last dose is taken (frequencyHours=24)', async () => {
      const medId = makeId();
      const userId = makeId().toString();
      // durationDays=7, frequencyHours=24 → totalDoses = 7; dosesTaken=6
      const saveMock = jest.fn();
      const medication: MedDoc = {
        _id: medId,
        name: 'Metformina',
        durationDays: 7,
        frequencyHours: 24,
        dosesTaken: 6,
        notificationIds: [],
        save: saveMock,
      };
      userService.getUserProfile.mockResolvedValue(makeProfile([medId]));
      medicationModel.findById.mockResolvedValue(medication);
      medicationModel.findByIdAndDelete.mockResolvedValue(medication);

      const result = await service.takeMedication(userId, medId.toString());

      expect(result.completed).toBe(true);
      expect(medicationModel.findByIdAndDelete).toHaveBeenCalledWith(
        medId.toString(),
      );
    });

    it('deletes and returns completed:true when last dose is taken (frequencyHours=4)', async () => {
      const medId = makeId();
      const userId = makeId().toString();
      // durationDays=1, frequencyHours=4 → totalDoses = 6; dosesTaken=5
      const saveMock = jest.fn();
      const medication: MedDoc = {
        _id: medId,
        name: 'Ibuprofeno 200mg',
        durationDays: 1,
        frequencyHours: 4,
        dosesTaken: 5,
        notificationIds: [],
        save: saveMock,
      };
      userService.getUserProfile.mockResolvedValue(makeProfile([medId]));
      medicationModel.findById.mockResolvedValue(medication);
      medicationModel.findByIdAndDelete.mockResolvedValue(medication);

      const result = await service.takeMedication(userId, medId.toString());

      expect(result.completed).toBe(true);
    });
  });

  // ─── removeMedication ─────────────────────────────────────────────────────

  describe('removeMedication', () => {
    it('throws NotFoundException when the medication is not found in the DB', async () => {
      const medId = makeId();
      userService.getUserProfile.mockResolvedValue(makeProfile([medId]));
      medicationModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(
        service.removeMedication(makeId().toString(), medId.toString()),
      ).rejects.toThrow(NotFoundException);
    });

    it('deletes the medication and removes it from the patient profile', async () => {
      const medId = makeId();
      const userId = makeId().toString();
      userService.getUserProfile.mockResolvedValue(makeProfile([medId]));
      medicationModel.findByIdAndDelete.mockResolvedValue({ _id: medId });

      const result = await service.removeMedication(userId, medId.toString());

      expect(patientModel.findOneAndUpdate).toHaveBeenCalledWith(
        { user: userId },
        { $pull: { medications: medId.toString() } },
      );
      expect(result.message).toBe('Medicamento eliminado exitosamente');
    });
  });
});
