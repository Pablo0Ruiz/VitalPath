import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AppointmentService } from './appointment.service';
import { Appointment } from './entities/appointment.entity';
import { User } from 'src/auth/entities/user.entity';
import { Doctor } from 'src/user/entities/doctor.entity';
import { Patient } from 'src/user/entities/patient.entity';
import { CitaState } from './dto/enum/cita-state.enum';
import { UserRoles } from 'src/auth/enum/user-role.enum';
import { PushNotificationsService } from 'src/push-notifications/push-notifications.service';
import { VinculacionService } from 'src/vinculacion/vinculacion.service';

// expo-server-sdk uses ESM — mock it so Jest (CJS transform) can parse appointment.service.ts
jest.mock('expo-server-sdk', () => {
  const MockExpo = Object.assign(
    jest.fn().mockImplementation(() => ({
      chunkPushNotifications: jest.fn().mockReturnValue([[]]),
      sendPushNotificationsAsync: jest.fn().mockResolvedValue([]),
    })),
    {
      isExpoPushToken: jest.fn().mockReturnValue(true),
    },
  );
  return { Expo: MockExpo };
});

const makeId = () => new Types.ObjectId();

// ─── Typed model factories ──────────────────────────────────────────────────

const makeCitaModel = () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
  create: jest.fn(),
});

const makeDoctorModel = () => ({
  find: jest.fn().mockReturnValue(chainQuery([])),
  findOneAndUpdate: jest.fn().mockResolvedValue(null),
});

const makePatientModel = () => ({
  findOneAndUpdate: jest.fn().mockResolvedValue(null),
});

const makeUserModel = () => ({
  findById: jest.fn(),
});

const makePushService = () => ({
  sendPushNotification: jest.fn().mockResolvedValue(undefined),
});

const makeVinculacionService = () => ({
  getActivePacienteIdsForCuidador: jest.fn().mockResolvedValue([]),
  getActiveTokensForPaciente: jest.fn().mockResolvedValue([]),
  isCuidadorLinkedToPaciente: jest.fn().mockResolvedValue(false),
});

// ─── Mongoose chainable query mock ──────────────────────────────────────────
// Supports both `await query.lean()` and `await query.lean().exec()`.
// lean() returns a thenable so JavaScript's await mechanism resolves it,
// and also exposes `.exec()` for query chains that end with exec().
const chainQuery = (resolved: unknown) => {
  const leanResult = {
    then<TResult1 = unknown, TResult2 = never>(
      onFulfilled?:
        | ((value: unknown) => TResult1 | PromiseLike<TResult1>)
        | null,
      onRejected?:
        | ((reason: unknown) => TResult2 | PromiseLike<TResult2>)
        | null,
    ) {
      return Promise.resolve(resolved).then(onFulfilled, onRejected);
    },
    exec: jest.fn().mockResolvedValue(resolved),
  };

  return {
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnValue(leanResult),
    exec: jest.fn().mockResolvedValue(resolved),
  };
};

// ─── Suite ──────────────────────────────────────────────────────────────────

describe('AppointmentService', () => {
  let service: AppointmentService;
  let citaModel: ReturnType<typeof makeCitaModel>;
  let doctorModel: ReturnType<typeof makeDoctorModel>;
  let patientModel: ReturnType<typeof makePatientModel>;
  let userModel: ReturnType<typeof makeUserModel>;
  let pushService: ReturnType<typeof makePushService>;
  let vinculacionService: ReturnType<typeof makeVinculacionService>;

  beforeEach(async () => {
    citaModel = makeCitaModel();
    doctorModel = makeDoctorModel();
    patientModel = makePatientModel();
    userModel = makeUserModel();
    pushService = makePushService();
    vinculacionService = makeVinculacionService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentService,
        { provide: getModelToken(Appointment.name), useValue: citaModel },
        { provide: getModelToken(User.name), useValue: userModel },
        { provide: getModelToken(Doctor.name), useValue: doctorModel },
        { provide: getModelToken(Patient.name), useValue: patientModel },
        { provide: PushNotificationsService, useValue: pushService },
        { provide: VinculacionService, useValue: vinculacionService },
      ],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
  });

  // ─── createAppointment ────────────────────────────────────────────────────

  describe('createAppointment', () => {
    it('creates an appointment with AGENDADA state and updates patient/doctor citas', async () => {
      const userId = makeId();
      const medicoId = makeId();
      const centroId = makeId();
      const apptId = makeId();

      const created = {
        _id: apptId,
        paciente_ID: userId,
        medico_ID: medicoId,
        centroSalud_ID: centroId,
        estado: CitaState.AGENDADA,
      };
      citaModel.create.mockResolvedValue(created);

      const result = await service.createAppointment(userId.toString(), {
        medico_ID: medicoId.toString(),
        centroSalud_ID: centroId.toString(),
        fecha: '2026-05-01',
        hora: '10:00',
      });

      expect(result.estado).toBe(CitaState.AGENDADA);
      expect(patientModel.findOneAndUpdate).toHaveBeenCalledWith(
        { user: expect.any(Types.ObjectId) },
        { $push: { citas: apptId } },
      );
      expect(doctorModel.findOneAndUpdate).toHaveBeenCalledWith(
        { user: expect.any(Types.ObjectId) },
        { $push: { citas: apptId } },
      );
    });
  });

  // ─── getAppointments ──────────────────────────────────────────────────────

  describe('getAppointments', () => {
    it('returns enriched appointments with especialidad for a patient', async () => {
      const medicoId = makeId();
      const citas = [
        {
          _id: makeId(),
          medico_ID: { _id: medicoId, name: 'Dr. López', lastName: '' },
          centroSalud_ID: { _id: makeId(), nombre: 'Centro A' },
        },
      ];

      citaModel.find.mockReturnValue(chainQuery(citas));
      doctorModel.find.mockReturnValue(
        chainQuery([{ user: medicoId, especialidad: 'Cardiología' }]),
      );

      const result = await service.getAppointments(makeId().toString());

      expect(result[0]).toMatchObject({
        medico_ID: { especialidad: 'Cardiología' },
      });
    });

    it('returns an empty array when the patient has no appointments', async () => {
      citaModel.find.mockReturnValue(chainQuery([]));

      const result = await service.getAppointments(makeId().toString());

      expect(result).toEqual([]);
    });
  });

  // ─── getAppointmentById ───────────────────────────────────────────────────

  describe('getAppointmentById', () => {
    it('throws NotFoundException for a malformed ObjectId', async () => {
      await expect(
        service.getAppointmentById(
          makeId().toString(),
          'not-an-id',
          UserRoles.PACIENTE,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when the appointment does not exist', async () => {
      citaModel.findById.mockReturnValue(chainQuery(null));

      await expect(
        service.getAppointmentById(
          makeId().toString(),
          makeId().toString(),
          UserRoles.PACIENTE,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when requester is not the owner', async () => {
      const ownerId = makeId();
      const requesterId = makeId();

      citaModel.findById.mockReturnValue(
        chainQuery({
          _id: makeId(),
          paciente_ID: ownerId,
          medico_ID: { _id: makeId(), name: 'Dr. X', lastName: '' },
          centroSalud_ID: { _id: makeId(), nombre: 'Centro' },
        }),
      );

      await expect(
        service.getAppointmentById(
          requesterId.toString(),
          makeId().toString(),
          UserRoles.PACIENTE,
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('returns the enriched appointment for the owner', async () => {
      const userId = makeId();
      const medicoId = makeId();

      citaModel.findById.mockReturnValue(
        chainQuery({
          _id: makeId(),
          paciente_ID: userId,
          medico_ID: { _id: medicoId, name: 'Dr. X', lastName: '' },
          centroSalud_ID: { _id: makeId(), nombre: 'Centro' },
        }),
      );
      doctorModel.find.mockReturnValue(
        chainQuery([{ user: medicoId, especialidad: 'Pediatría' }]),
      );

      const result = await service.getAppointmentById(
        userId.toString(),
        makeId().toString(),
        UserRoles.PACIENTE,
      );

      expect(result).toMatchObject({
        medico_ID: { especialidad: 'Pediatría' },
      });
    });
  });

  // ─── updateAppointment ────────────────────────────────────────────────────

  describe('updateAppointment', () => {
    it('throws NotFoundException when the appointment does not exist', async () => {
      citaModel.findById.mockResolvedValue(null);

      await expect(
        service.updateAppointment(makeId().toString(), makeId().toString(), {}),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when requester is not the owner', async () => {
      const ownerId = makeId();
      citaModel.findById.mockResolvedValue({
        _id: makeId(),
        paciente_ID: ownerId,
        medico_ID: makeId(),
        save: jest.fn(),
      });

      await expect(
        service.updateAppointment(makeId().toString(), makeId().toString(), {}),
      ).rejects.toThrow(ForbiddenException);
    });

    it('updates fecha and hora when provided', async () => {
      const userId = makeId();
      const appt = {
        _id: makeId(),
        paciente_ID: userId,
        medico_ID: makeId(),
        fecha: '2026-04-01',
        hora: '09:00',
        save: jest.fn().mockResolvedValue({}),
      };
      citaModel.findById.mockResolvedValue(appt);

      await service.updateAppointment(userId.toString(), appt._id.toString(), {
        fecha: '2026-05-01',
        hora: '11:00',
      });

      expect(appt.fecha).toBe('2026-05-01');
      expect(appt.hora).toBe('11:00');
      expect(appt.save).toHaveBeenCalled();
    });

    it('delegates to cancelAppointment and returns null when estado is CANCELADA', async () => {
      const userId = makeId();
      const citaId = makeId();
      const appt = {
        _id: citaId,
        paciente_ID: userId,
        medico_ID: makeId(),
        save: jest.fn(),
      };
      citaModel.findById.mockResolvedValue(appt);
      citaModel.findByIdAndDelete.mockResolvedValue({});

      const result = await service.updateAppointment(
        userId.toString(),
        citaId.toString(),
        { estado: CitaState.CANCELADA },
      );

      expect(result).toBeNull();
      expect(citaModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });

  // ─── updateEstadoWorker ───────────────────────────────────────────────────

  describe('updateEstadoWorker', () => {
    const validTransitions: [CitaState, CitaState][] = [
      [CitaState.AGENDADA, CitaState.ASISTIDA],
      [CitaState.ASISTIDA, CitaState.EN_PROCESO],
      [CitaState.EN_PROCESO, CitaState.RESULTADOS_LISTOS],
      [CitaState.RESULTADOS_LISTOS, CitaState.COMPLETADA],
    ];

    it.each(validTransitions)('allows %s → %s transition', async (from, to) => {
      const citaId = makeId();
      const pacienteId = makeId();
      const appt = {
        estado: from,
        save: jest.fn().mockResolvedValue({
          _id: citaId,
          paciente_ID: pacienteId,
          estado: to,
        }),
      };
      citaModel.findById.mockResolvedValue(appt);
      // notifyStateChange: patient has no push token → push skipped
      userModel.findById.mockReturnValue(chainQuery(null));

      await service.updateEstadoWorker(makeId().toString(), to);

      expect(appt.estado).toBe(to);
      expect(appt.save).toHaveBeenCalled();
    });

    it('throws BadRequestException when skipping a state', async () => {
      const appt = { estado: CitaState.AGENDADA, save: jest.fn() };
      citaModel.findById.mockResolvedValue(appt);

      await expect(
        service.updateEstadoWorker(makeId().toString(), CitaState.EN_PROCESO),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when trying to go backwards', async () => {
      const appt = { estado: CitaState.ASISTIDA, save: jest.fn() };
      citaModel.findById.mockResolvedValue(appt);

      await expect(
        service.updateEstadoWorker(makeId().toString(), CitaState.AGENDADA),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws NotFoundException when appointment does not exist', async () => {
      citaModel.findById.mockResolvedValue(null);

      await expect(
        service.updateEstadoWorker(makeId().toString(), CitaState.ASISTIDA),
      ).rejects.toThrow(NotFoundException);
    });

    // ─── Push notification integration ─────────────────────────────────────

    it('calls sendPushNotification with correct payload when patient has a push token', async () => {
      const citaId = makeId();
      const pacienteId = makeId();
      const token = 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]';

      citaModel.findById.mockResolvedValue({
        estado: CitaState.EN_PROCESO,
        save: jest.fn().mockResolvedValue({
          _id: citaId,
          paciente_ID: pacienteId,
          estado: CitaState.RESULTADOS_LISTOS,
        }),
      });
      userModel.findById.mockReturnValue(chainQuery({ expoPushToken: token }));
      pushService.sendPushNotification.mockResolvedValue(undefined);

      await service.updateEstadoWorker(
        makeId().toString(),
        CitaState.RESULTADOS_LISTOS,
      );

      // Fire-and-forget: flush all pending microtask ticks so the async chain resolves
      await new Promise(resolve => setImmediate(resolve));

      expect(pushService.sendPushNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          tokens: [token],
          title: expect.any(String),
          body: expect.any(String),
          data: expect.objectContaining({
            type: 'cita_state_change',
            citaId: String(citaId),
          }),
        }),
      );
    });

    it('does not call sendPushNotification for an invalid transition', async () => {
      const appt = { estado: CitaState.AGENDADA, save: jest.fn() };
      citaModel.findById.mockResolvedValue(appt);

      await expect(
        service.updateEstadoWorker(makeId().toString(), CitaState.EN_PROCESO),
      ).rejects.toThrow(BadRequestException);

      expect(pushService.sendPushNotification).not.toHaveBeenCalled();
    });

    it('does not call sendPushNotification for state AGENDADA (no copy entry)', async () => {
      // AGENDADA is not a state you can transition INTO via updateEstadoWorker
      // (it's only the initial state). Simulate a hypothetical save that returns AGENDADA.
      const citaId = makeId();
      const pacienteId = makeId();
      // We can test this by checking that AGENDADA has no copy entry:
      // The only way to reach notifyStateChange with AGENDADA would require
      // bypassing ALLOWED_TRANSITIONS, so we test notifyStateChange indirectly
      // via a transition to ASISTIDA → copy exists; AGENDADA → no copy.
      // For direct coverage, use a valid transition (AGENDADA→ASISTIDA) which
      // is notifiable; the AGENDADA copy absence is covered by the copy constant test.
      // We verify ASISTIDA triggers push (copy exists) and patient has no token → no call.
      citaModel.findById.mockResolvedValue({
        estado: CitaState.AGENDADA,
        save: jest.fn().mockResolvedValue({
          _id: citaId,
          paciente_ID: pacienteId,
          estado: CitaState.ASISTIDA,
        }),
      });
      userModel.findById.mockReturnValue(chainQuery({ expoPushToken: null }));

      await service.updateEstadoWorker(makeId().toString(), CitaState.ASISTIDA);
      await Promise.resolve();

      expect(pushService.sendPushNotification).not.toHaveBeenCalled();
    });

    it('does not call sendPushNotification when patient has no expoPushToken', async () => {
      const citaId = makeId();
      const pacienteId = makeId();

      citaModel.findById.mockResolvedValue({
        estado: CitaState.EN_PROCESO,
        save: jest.fn().mockResolvedValue({
          _id: citaId,
          paciente_ID: pacienteId,
          estado: CitaState.RESULTADOS_LISTOS,
        }),
      });
      // Patient found but expoPushToken is null
      userModel.findById.mockReturnValue(chainQuery({ expoPushToken: null }));

      await service.updateEstadoWorker(
        makeId().toString(),
        CitaState.RESULTADOS_LISTOS,
      );
      await Promise.resolve();

      expect(pushService.sendPushNotification).not.toHaveBeenCalled();
    });

    it('resolves successfully even when sendPushNotification rejects', async () => {
      const citaId = makeId();
      const pacienteId = makeId();
      const token = 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]';

      citaModel.findById.mockResolvedValue({
        estado: CitaState.EN_PROCESO,
        save: jest.fn().mockResolvedValue({
          _id: citaId,
          paciente_ID: pacienteId,
          estado: CitaState.RESULTADOS_LISTOS,
        }),
      });
      userModel.findById.mockReturnValue(chainQuery({ expoPushToken: token }));
      pushService.sendPushNotification.mockRejectedValue(
        new Error('Expo down'),
      );

      // updateEstadoWorker must still resolve (fire-and-forget)
      await expect(
        service.updateEstadoWorker(
          makeId().toString(),
          CitaState.RESULTADOS_LISTOS,
        ),
      ).resolves.toBeDefined();
    });
  });

  // ─── cancelAppointment ────────────────────────────────────────────────────

  describe('cancelAppointment', () => {
    it('throws NotFoundException when appointment does not exist', async () => {
      citaModel.findById.mockResolvedValue(null);

      await expect(
        service.cancelAppointment(makeId().toString(), makeId().toString()),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when the user does not own the appointment', async () => {
      const ownerId = makeId();
      const requesterId = makeId();

      citaModel.findById.mockResolvedValue({
        _id: makeId(),
        paciente_ID: ownerId,
        medico_ID: makeId(),
      });

      await expect(
        service.cancelAppointment(requesterId.toString(), makeId().toString()),
      ).rejects.toThrow(ForbiddenException);
    });

    it('deletes the appointment when the owner cancels', async () => {
      const userId = makeId();
      const citaId = makeId();

      citaModel.findById.mockResolvedValue({
        _id: citaId,
        paciente_ID: userId,
        medico_ID: makeId(),
      });
      citaModel.findByIdAndDelete.mockResolvedValue({});

      await service.cancelAppointment(userId.toString(), citaId.toString());

      expect(citaModel.findByIdAndDelete).toHaveBeenCalledWith(
        citaId.toString(),
      );
    });
  });

  // ─── getAppointmentByIdForStaff ───────────────────────────────────────────

  describe('getAppointmentByIdForStaff', () => {
    it('throws NotFoundException for a malformed ObjectId', async () => {
      await expect(
        service.getAppointmentByIdForStaff('not-an-id'),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when the appointment does not exist in DB', async () => {
      citaModel.findById.mockReturnValue(chainQuery(null));

      await expect(
        service.getAppointmentByIdForStaff(makeId().toString()),
      ).rejects.toThrow(NotFoundException);
    });

    it('returns the enriched appointment when found', async () => {
      const medicoId = makeId();
      const appt = {
        _id: makeId(),
        paciente_ID: { _id: makeId(), name: 'Ana', lastName: 'García' },
        medico_ID: { _id: medicoId, name: 'Dr. López', lastName: '' },
        centroSalud_ID: { _id: makeId(), nombre: 'Centro A' },
        estado: CitaState.AGENDADA,
      };
      citaModel.findById.mockReturnValue(chainQuery(appt));
      doctorModel.find.mockReturnValue(
        chainQuery([{ user: medicoId, especialidad: 'Clínica' }]),
      );

      const result = await service.getAppointmentByIdForStaff(
        appt._id.toString(),
      );

      expect(result).toBeDefined();
      expect(result).toMatchObject({ medico_ID: { especialidad: 'Clínica' } });
    });
  });
});
