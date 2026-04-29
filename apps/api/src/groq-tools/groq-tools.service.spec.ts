import { Test, TestingModule } from '@nestjs/testing';
import { GroqToolsService } from './groq-tools.service';
import { HospitalsService } from 'src/hospitals/hospitals.service';
import { AppointmentService } from 'src/appointment/appointment.service';
import { UserService } from 'src/user/user.service';
import { UserRoles } from 'src/auth/enum/user-role.enum';

const mockHospitalsService = {
  getDoctors: jest.fn(),
  getCentrosSalud: jest.fn(),
};
const mockAppointmentService = {
  createAppointment: jest.fn(),
  getAppointments: jest.fn(),
  getAppointmentById: jest.fn(),
  updateAppointment: jest.fn(),
  cancelAppointment: jest.fn(),
  getAppointmentsMedico: jest.fn(),
  getAppointmentByIdForStaff: jest.fn(),
  getAppointmentsAdministrator: jest.fn(),
  updateEstadoWorker: jest.fn(),
};
const mockUserService = { getUserProfile: jest.fn() };

describe('GroqToolsService.getToolsFor', () => {
  let service: GroqToolsService;
  const userId = 'user-abc';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroqToolsService,
        { provide: HospitalsService, useValue: mockHospitalsService },
        { provide: AppointmentService, useValue: mockAppointmentService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get<GroqToolsService>(GroqToolsService);
  });

  describe('PACIENTE', () => {
    it('includes the full appointment + study toolset', () => {
      const keys = Object.keys(service.getToolsFor(userId, UserRoles.PACIENTE));
      expect(keys).toEqual(
        expect.arrayContaining([
          'createAppointment',
          'getAppointments',
          'getAppointmentById',
          'updateAppointment',
          'cancelAppointment',
          'getDoctors',
          'getCentrosSalud',
          'getMisEstudios',
        ]),
      );
    });

    it('does NOT include worker or doctor private tools', () => {
      const keys = Object.keys(service.getToolsFor(userId, UserRoles.PACIENTE));
      expect(keys).not.toContain('getAllCitas');
      expect(keys).not.toContain('getMisCitas');
      expect(keys).not.toContain('actualizarEstadoCita');
    });
  });

  describe('MEDICO', () => {
    it('includes own-appointments + patient lookup + directory tools', () => {
      const keys = Object.keys(service.getToolsFor(userId, UserRoles.MEDICO));
      expect(keys).toEqual(
        expect.arrayContaining([
          'getMisCitas',
          'getPacienteData',
          'getDoctors',
          'getCentrosSalud',
        ]),
      );
    });

    it('does NOT include patient booking or worker tools', () => {
      const keys = Object.keys(service.getToolsFor(userId, UserRoles.MEDICO));
      expect(keys).not.toContain('createAppointment');
      expect(keys).not.toContain('cancelAppointment');
      expect(keys).not.toContain('getAllCitas');
      expect(keys).not.toContain('actualizarEstadoCita');
    });
  });

  describe('TRABAJADOR_CENTRO', () => {
    it('includes all admin tools', () => {
      const keys = Object.keys(
        service.getToolsFor(userId, UserRoles.TRABAJADOR_CENTRO),
      );
      expect(keys).toEqual(
        expect.arrayContaining([
          'getAllCitas',
          'actualizarEstadoCita',
          'getPacienteData',
        ]),
      );
    });

    it('does NOT include patient personal or doctor personal tools', () => {
      const keys = Object.keys(
        service.getToolsFor(userId, UserRoles.TRABAJADOR_CENTRO),
      );
      expect(keys).not.toContain('createAppointment');
      expect(keys).not.toContain('getMisCitas');
      expect(keys).not.toContain('getMisEstudios');
    });
  });

  it('returns an empty toolset for roles without a tool mapping', () => {
    const tools = service.getToolsFor(userId, UserRoles.ADMIN);
    expect(Object.keys(tools)).toHaveLength(0);
  });
});
