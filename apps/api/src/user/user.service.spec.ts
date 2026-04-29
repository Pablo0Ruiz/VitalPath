import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { UserService } from './user.service';
import { User } from 'src/auth/entities/user.entity';
import { Doctor } from './entities/doctor.entity';
import { Patient } from './entities/patient.entity';
import { UserRoles } from 'src/auth/enum/user-role.enum';

// ─── Model factories ──────────────────────────────────────────────────────────

const makeUserModel = () => ({
  findById: jest.fn(),
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

const makePatientModel = () => ({
  findOne: jest.fn(),
});

const makeDoctorModel = () => ({
  findOne: jest.fn(),
});

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('UserService', () => {
  let service: UserService;
  let userModel: ReturnType<typeof makeUserModel>;
  let patientModel: ReturnType<typeof makePatientModel>;
  let doctorModel: ReturnType<typeof makeDoctorModel>;

  beforeEach(async () => {
    userModel = makeUserModel();
    patientModel = makePatientModel();
    doctorModel = makeDoctorModel();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(User.name), useValue: userModel },
        { provide: getModelToken(Doctor.name), useValue: doctorModel },
        { provide: getModelToken(Patient.name), useValue: patientModel },
      ],
    }).compile();

    service = module.get(UserService);
  });

  // ─── getUserProfile ───────────────────────────────────────────────────────

  describe('getUserProfile', () => {
    const userId = new Types.ObjectId().toString();

    it('throws when the user document is not found', async () => {
      userModel.findById.mockResolvedValue(null);

      await expect(service.getUserProfile(userId)).rejects.toThrow(
        'Error al obtener el perfil',
      );
    });

    it('returns user with patient profile when role is PACIENTE', async () => {
      const userDoc = {
        _id: userId,
        role: UserRoles.PACIENTE,
        toObject: () => ({ _id: userId, role: UserRoles.PACIENTE }),
      };
      const patientProfile = { medications: [], citas: [] };

      userModel.findById.mockResolvedValue(userDoc);
      patientModel.findOne.mockReturnValue(makePopulatable(patientProfile));

      const result = await service.getUserProfile(userId);

      expect(result.profile).toBe(patientProfile);
      expect(patientModel.findOne).toHaveBeenCalledWith({ user: userId });
    });

    it('returns user with doctor profile when role is MEDICO', async () => {
      const userDoc = {
        _id: userId,
        role: UserRoles.MEDICO,
        toObject: () => ({ _id: userId, role: UserRoles.MEDICO }),
      };
      const doctorProfile = { citas: [] };

      userModel.findById.mockResolvedValue(userDoc);
      doctorModel.findOne.mockReturnValue(makePopulatable(doctorProfile));

      const result = await service.getUserProfile(userId);

      expect(result.profile).toBe(doctorProfile);
      expect(doctorModel.findOne).toHaveBeenCalledWith({ user: userId });
    });

    it('returns user with null profile for roles other than PACIENTE/MEDICO', async () => {
      const userDoc = {
        _id: userId,
        role: UserRoles.TRABAJADOR_CENTRO,
        toObject: () => ({ _id: userId, role: UserRoles.TRABAJADOR_CENTRO }),
      };
      userModel.findById.mockResolvedValue(userDoc);

      const result = await service.getUserProfile(userId);

      expect(result.profile).toBeNull();
      expect(patientModel.findOne).not.toHaveBeenCalled();
      expect(doctorModel.findOne).not.toHaveBeenCalled();
    });
  });
});
