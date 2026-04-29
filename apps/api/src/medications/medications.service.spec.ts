import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { MedicationsService } from './medications.service';
import { Medication } from './entities/medication.entity';
import { Patient } from 'src/user/entities/patient.entity';
import { UserService } from 'src/user/user.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';

const makeId = () => new Types.ObjectId();

// ─── Mock interfaces ──────────────────────────────────────────────────────────

interface MedDoc {
  _id: Types.ObjectId;
  name: string;
  description?: string;
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
