import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';

import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { Doctor } from 'src/user/entities/doctor.entity';
import { Patient } from 'src/user/entities/patient.entity';
import { CentroSalud } from 'src/user/entities/centro-salud.entity';
import { EmailService } from 'src/common/email/email.service';
import { UserRoles } from './enum/user-role.enum';
import { Especialidad } from './enum/especialidad.enum';

jest.mock('bcrypt', () => ({
  hashSync: jest.fn(() => 'hashed_password'),
  compareSync: jest.fn(() => true),
  hash: jest.fn().mockResolvedValue('hashed_refresh_token'),
  compare: jest.fn().mockResolvedValue(true),
}));

import * as bcrypt from 'bcrypt';

const makeId = () => new Types.ObjectId();

// ─── Mock interfaces ─────────────────────────────────────────────────────────

interface UserDoc {
  _id: Types.ObjectId;
  id: string;
  email: string;
  name: string;
  password: string;
  role: UserRoles;
  isActive: boolean;
  fechaNacimiento?: Date;
  verificationCode?: string;
  centroSalud_ID?: Types.ObjectId | null;
  save: jest.Mock;
  toObject: () => Omit<UserDoc, 'toObject' | 'save'>;
}

interface CentroDoc {
  _id: Types.ObjectId;
  codigoVinculacion: string;
  listaMedicos_ID: Types.ObjectId[];
  listaTrabajadores_ID: Types.ObjectId[];
  save: jest.Mock;
}

// ─── Factories ───────────────────────────────────────────────────────────────

const makeUserDoc = (overrides: Partial<UserDoc> = {}): UserDoc => {
  const id = makeId();
  const base: UserDoc = {
    _id: id,
    id: id.toString(),
    email: 'user@example.com',
    name: 'Test',
    password: 'hashed_password',
    role: UserRoles.PACIENTE,
    isActive: false,
    save: jest.fn().mockResolvedValue(undefined),
    toObject() {
      return {
        _id: this._id,
        id: this.id,
        email: this.email,
        name: this.name,
        password: this.password,
        role: this.role,
        isActive: this.isActive,
        fechaNacimiento: this.fechaNacimiento,
        verificationCode: this.verificationCode,
        centroSalud_ID: this.centroSalud_ID,
      };
    },
  };
  return { ...base, ...overrides };
};

const makeCentroDoc = (): CentroDoc => ({
  _id: makeId(),
  codigoVinculacion: 'VERIFY123',
  listaMedicos_ID: [],
  listaTrabajadores_ID: [],
  save: jest.fn().mockResolvedValue(undefined),
});

const makeUserModel = () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn().mockResolvedValue(null),
});

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('AuthService', () => {
  let service: AuthService;
  let userModel: ReturnType<typeof makeUserModel>;
  let doctorModel: { create: jest.Mock };
  let patientModel: { create: jest.Mock };
  let centroSaludModel: { findOne: jest.Mock };
  let jwtService: { sign: jest.Mock };
  let emailService: { sendRecoverPasswordEmail: jest.Mock };
  let configService: { get: jest.Mock };

  beforeEach(async () => {
    userModel = makeUserModel();
    doctorModel = { create: jest.fn() };
    patientModel = { create: jest.fn() };
    centroSaludModel = { findOne: jest.fn() };
    jwtService = { sign: jest.fn().mockReturnValue('test_token') };
    emailService = {
      sendRecoverPasswordEmail: jest.fn().mockResolvedValue(undefined),
    };
    configService = { get: jest.fn().mockReturnValue('test_refresh_secret') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User.name), useValue: userModel },
        { provide: getModelToken(Doctor.name), useValue: doctorModel },
        { provide: getModelToken(Patient.name), useValue: patientModel },
        {
          provide: getModelToken(CentroSalud.name),
          useValue: centroSaludModel,
        },
        { provide: JwtService, useValue: jwtService },
        { provide: EmailService, useValue: emailService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  // ─── login ───────────────────────────────────────────────────────────────

  describe('login', () => {
    const loginDto = { email: 'user@example.com', password: 'secret' };

    it('throws UnauthorizedException when email is not found', async () => {
      userModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException when password is incorrect', async () => {
      userModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(makeUserDoc()),
      });
      (bcrypt.compareSync as jest.Mock).mockReturnValueOnce(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('returns user without password and a JWT token on success', async () => {
      userModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(makeUserDoc()),
      });
      (bcrypt.compareSync as jest.Mock).mockReturnValueOnce(true);

      const result = await service.login(loginDto);

      expect(result.token).toBe('test_token');
      expect(result.user).not.toHaveProperty('password');
    });
  });

  // ─── create ──────────────────────────────────────────────────────────────

  describe('create', () => {
    const baseDto = {
      email: 'new@example.com',
      password: 'secret',
      name: 'New',
      lastName: 'User',
      fechaNacimiento: new Date('1990-01-01'),
      centroSalud_ID: '',
      genero: '',
    };

    it('creates a Patient profile when role is PACIENTE', async () => {
      const user = makeUserDoc({ role: UserRoles.PACIENTE });
      userModel.create.mockResolvedValue(user);

      await service.create({ ...baseDto, role: UserRoles.PACIENTE });

      expect(patientModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ user: user._id }),
      );
      expect(doctorModel.create).not.toHaveBeenCalled();
    });

    it('creates a Doctor profile when role is MEDICO', async () => {
      const user = makeUserDoc({ role: UserRoles.MEDICO });
      userModel.create.mockResolvedValue(user);

      await service.create({
        ...baseDto,
        role: UserRoles.MEDICO,
        especialidad: Especialidad.MEDICINA_GENERAL,
        slots: [],
      });

      expect(doctorModel.create).toHaveBeenCalled();
      expect(patientModel.create).not.toHaveBeenCalled();
    });

    it('returns user without password and a JWT token', async () => {
      const user = makeUserDoc({ role: UserRoles.PACIENTE });
      userModel.create.mockResolvedValue(user);

      const result = await service.create({
        ...baseDto,
        role: UserRoles.PACIENTE,
      });

      expect(result.token).toBe('test_token');
      expect(result.user).not.toHaveProperty('password');
    });
  });

  // ─── loginWithCode ─────────────────────────────────────────────────────────
  describe('loginWithCode', () => {
    it('throws UnauthorizedException when code is invalid or user is too young', async () => {
      userModel.findOne.mockResolvedValue(null);

      await expect(service.loginWithCode('WRONG')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('returns user and token on success for seniors (>65 years)', async () => {
      const seniorUser = makeUserDoc({
        fechaNacimiento: new Date('1950-01-01'),
      });
      userModel.findOne.mockResolvedValue(seniorUser);

      const result = await service.loginWithCode('VALID123');

      expect(result.token).toBe('test_token');
      expect((result.user as unknown as { id: string }).id).toBe(seniorUser.id);
    });
  });

  // ─── recoverPassword ─────────────────────────────────────────────────────

  describe('recoverPassword', () => {
    const safeMessage =
      'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña';

    it('returns the safe message without sending email when user does not exist', async () => {
      userModel.findOne.mockResolvedValue(null);

      const result = await service.recoverPassword({
        email: 'ghost@example.com',
      });

      expect(result.message).toBe(safeMessage);
      expect(emailService.sendRecoverPasswordEmail).not.toHaveBeenCalled();
    });

    it('sends the recovery email and returns the safe message when user exists', async () => {
      const user = makeUserDoc({ email: 'ana@example.com', name: 'Ana' });
      userModel.findOne.mockResolvedValue(user);

      const result = await service.recoverPassword({ email: user.email });

      expect(emailService.sendRecoverPasswordEmail).toHaveBeenCalledWith(
        user.email,
        expect.any(String),
      );
      expect(result.message).toBe(safeMessage);
    });
  });

  // ─── verifyDoctor ─────────────────────────────────────────────────────────

  describe('verifyDoctor', () => {
    const code = 'VERIFY123';
    const dto = { email: 'doc@example.com', role: UserRoles.MEDICO };

    it('throws UnauthorizedException when the centro is not found', async () => {
      centroSaludModel.findOne.mockResolvedValue(null);
      userModel.findOne.mockResolvedValue(null);

      await expect(service.verifyDoctor(dto, code)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException when the user is not found', async () => {
      centroSaludModel.findOne.mockResolvedValue(makeCentroDoc());
      userModel.findOne.mockResolvedValue(null);

      await expect(service.verifyDoctor(dto, code)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException when the user role does not match', async () => {
      centroSaludModel.findOne.mockResolvedValue(makeCentroDoc());
      userModel.findOne.mockResolvedValue(
        makeUserDoc({ email: dto.email, role: UserRoles.PACIENTE }),
      );

      await expect(service.verifyDoctor(dto, code)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('activates the user and links them to the centro on success', async () => {
      const centro = makeCentroDoc();
      const user = makeUserDoc({
        email: dto.email,
        role: UserRoles.MEDICO,
        verificationCode: code,
      });
      centroSaludModel.findOne.mockResolvedValue(centro);
      userModel.findOne.mockResolvedValue(user);

      await service.verifyDoctor(dto, code);

      expect(user.isActive).toBe(true);
      expect(user.save).toHaveBeenCalled();
      expect(centro.save).toHaveBeenCalled();
      expect(centro.listaMedicos_ID).toContain(user._id);
    });
  });
});
