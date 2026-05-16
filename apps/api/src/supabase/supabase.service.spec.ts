import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { SupabaseService } from './supabase.service';
import { SUPABASE_CLIENT } from './supabase.constants';
import { ResultadoEstudio } from 'src/user/entities/resultado-estudio.entity';
import { Patient } from 'src/user/entities/patient.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { GroqService } from 'src/groq/groq.service';
import { CitaState } from 'src/appointment/dto/enum/cita-state.enum';

// ─── Multer file factory ──────────────────────────────────────────────────────

const fakeFile = (
  overrides: Partial<Express.Multer.File> = {},
): Express.Multer.File =>
  ({
    buffer: Buffer.from('PDF content'),
    originalname: 'estudio.pdf',
    mimetype: 'application/pdf',
    ...overrides,
  }) as Express.Multer.File;

// ─── Supabase client mock ─────────────────────────────────────────────────────

const makeStorageOps = () => ({
  upload: jest.fn(),
  download: jest.fn(),
  getPublicUrl: jest.fn(),
});

const makeSupabase = (ops: ReturnType<typeof makeStorageOps>) => ({
  storage: {
    listBuckets: jest.fn(),
    from: jest.fn().mockReturnValue(ops),
  },
});

// ─── Model factories ──────────────────────────────────────────────────────────

const makeResultadoModel = () => ({
  create: jest.fn(),
  find: jest.fn(),
  findByIdAndUpdate: jest.fn(),
});

const makePatientModel = () => ({
  findOneAndUpdate: jest.fn(),
});

const makeAppointmentModel = () => ({
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
});

const makeGroqService = () => ({
  resumenResultadoEstudio: jest.fn(),
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

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('SupabaseService', () => {
  let service: SupabaseService;
  let storageOps: ReturnType<typeof makeStorageOps>;
  let supabase: ReturnType<typeof makeSupabase>;
  let resultadoModel: ReturnType<typeof makeResultadoModel>;
  let patientModel: ReturnType<typeof makePatientModel>;
  let appointmentModel: ReturnType<typeof makeAppointmentModel>;
  let groqService: ReturnType<typeof makeGroqService>;

  beforeEach(async () => {
    storageOps = makeStorageOps();
    supabase = makeSupabase(storageOps);
    resultadoModel = makeResultadoModel();
    patientModel = makePatientModel();
    appointmentModel = makeAppointmentModel();
    groqService = makeGroqService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupabaseService,
        { provide: SUPABASE_CLIENT, useValue: supabase },
        {
          provide: getModelToken(ResultadoEstudio.name),
          useValue: resultadoModel,
        },
        { provide: getModelToken(Patient.name), useValue: patientModel },
        {
          provide: getModelToken(Appointment.name),
          useValue: appointmentModel,
        },
        { provide: GroqService, useValue: groqService },
      ],
    }).compile();

    service = module.get(SupabaseService);
  });

  // ─── uploadFile ───────────────────────────────────────────────────────────

  describe('uploadFile', () => {
    const pacienteId = new Types.ObjectId().toString();
    const citaId = new Types.ObjectId().toString();
    const uploadedData = {
      fullPath: 'vitalpath-storage/public/123/estudio.pdf',
      path: 'public/123/estudio.pdf',
      id: 'abc',
    };

    beforeEach(() => {
      storageOps.upload.mockResolvedValue({ data: uploadedData, error: null });
      resultadoModel.create.mockResolvedValue({ _id: new Types.ObjectId() });
    });

    it('creates a ResultadoEstudio and returns upload data', async () => {
      const result = await service.uploadFile([fakeFile()], {});

      expect(storageOps.upload).toHaveBeenCalled();
      expect(resultadoModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ fileUrl: uploadedData.fullPath }),
      );
      expect(result).toBe(uploadedData);
    });

    it('updates the Patient resultadosEstudio array when paciente_ID is provided', async () => {
      await service.uploadFile([fakeFile()], { paciente_ID: pacienteId });

      expect(patientModel.findOneAndUpdate).toHaveBeenCalledWith(
        { user: expect.any(Types.ObjectId) },
        { $push: { resultadosEstudio: expect.anything() } },
      );
    });

    it('sets medico_ID from the cita when cita_ID is provided', async () => {
      const medicoId = new Types.ObjectId();
      appointmentModel.findById.mockResolvedValue({
        medico_ID: medicoId,
        estado: CitaState.COMPLETADA,
      });

      await service.uploadFile([fakeFile()], { cita_ID: citaId });

      expect(resultadoModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ medico_ID: medicoId }),
      );
    });

    it('advances cita estado from ASISTIDA to EN_PROCESO', async () => {
      appointmentModel.findById.mockResolvedValue({
        medico_ID: new Types.ObjectId(),
        estado: CitaState.ASISTIDA,
      });

      await service.uploadFile([fakeFile()], { cita_ID: citaId });

      expect(appointmentModel.findByIdAndUpdate).toHaveBeenCalledWith(citaId, {
        estado: CitaState.EN_PROCESO,
      });
    });

    it('advances cita estado from EN_PROCESO to RESULTADOS_LISTOS', async () => {
      appointmentModel.findById.mockResolvedValue({
        medico_ID: new Types.ObjectId(),
        estado: CitaState.EN_PROCESO,
      });

      await service.uploadFile([fakeFile()], { cita_ID: citaId });

      expect(appointmentModel.findByIdAndUpdate).toHaveBeenCalledWith(citaId, {
        estado: CitaState.RESULTADOS_LISTOS,
      });
    });

    it('advances cita estado from RESULTADOS_LISTOS to COMPLETADA', async () => {
      appointmentModel.findById.mockResolvedValue({
        medico_ID: new Types.ObjectId(),
        estado: CitaState.RESULTADOS_LISTOS,
      });

      await service.uploadFile([fakeFile()], { cita_ID: citaId });

      expect(appointmentModel.findByIdAndUpdate).toHaveBeenCalledWith(citaId, {
        estado: CitaState.COMPLETADA,
      });
    });

    it('does NOT advance estado when cita is already COMPLETADA', async () => {
      appointmentModel.findById.mockResolvedValue({
        medico_ID: new Types.ObjectId(),
        estado: CitaState.COMPLETADA,
      });

      await service.uploadFile([fakeFile()], { cita_ID: citaId });

      expect(appointmentModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('throws when Supabase storage upload fails', async () => {
      storageOps.upload.mockResolvedValue({
        data: null,
        error: { message: 'storage full' },
      });

      await expect(service.uploadFile([fakeFile()], {})).rejects.toThrow(
        'Error subiendo archivo: storage full',
      );
    });
  });

  // ─── updateResumenMedico ──────────────────────────────────────────────────

  describe('updateResumenMedico', () => {
    const resultadoId = new Types.ObjectId().toString();

    it('returns the updated ResultadoEstudio', async () => {
      const updated = { _id: resultadoId, resumenMedico: 'Análisis normal' };
      resultadoModel.findByIdAndUpdate.mockResolvedValue(updated);

      const result = await service.updateResumenMedico(
        resultadoId,
        'Análisis normal',
      );

      expect(result).toBe(updated);
      expect(resultadoModel.findByIdAndUpdate).toHaveBeenCalledWith(
        resultadoId,
        { resumenMedico: 'Análisis normal' },
        { returnDocument: 'after' },
      );
    });

    it('throws NotFoundException when resultado does not exist', async () => {
      resultadoModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(
        service.updateResumenMedico(resultadoId, 'x'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ─── downloadFile ─────────────────────────────────────────────────────────

  describe('downloadFile', () => {
    const path = 'public/123/estudio.pdf';

    it('returns the file as a base64 string', async () => {
      const content = Buffer.from('PDF binary content');
      const arrayBuffer = Uint8Array.from(content).buffer;
      const fakeBlob = {
        arrayBuffer: jest.fn().mockResolvedValue(arrayBuffer),
      };
      storageOps.download.mockResolvedValue({ data: fakeBlob, error: null });

      const result = await service.downloadFile(path);

      expect(typeof result).toBe('string');
      expect(result).toBe(content.toString('base64'));
    });

    it('throws when Supabase download fails', async () => {
      storageOps.download.mockResolvedValue({
        data: null,
        error: { message: 'not found' },
      });

      await expect(service.downloadFile(path)).rejects.toThrow(
        'Error descargando archivo: not found',
      );
    });
  });

  // ─── getPublicUrl ─────────────────────────────────────────────────────────

  describe('getPublicUrl', () => {
    const path = 'public/123/estudio.pdf';

    beforeEach(() => {
      const content = Buffer.from('PDF content');
      const fakeBlob = {
        arrayBuffer: jest.fn().mockResolvedValue(content.buffer),
      };
      storageOps.download.mockResolvedValue({ data: fakeBlob, error: null });
      storageOps.getPublicUrl.mockReturnValue({
        data: { publicUrl: 'https://cdn.example.com/estudio.pdf' },
      });
    });

    it('returns publicUrl and Groq resumen when both succeed', async () => {
      groqService.resumenResultadoEstudio.mockResolvedValue(
        'Resumen del estudio',
      );

      const result = await service.getPublicUrl(path);

      expect(result.publicUrl).toBe('https://cdn.example.com/estudio.pdf');
      expect(result.resumen).toBe('Resumen del estudio');
    });

    it('returns fallback resumen when Groq fails', async () => {
      jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      groqService.resumenResultadoEstudio.mockRejectedValue(
        new Error('Groq unavailable'),
      );

      const result = await service.getPublicUrl(path);

      expect(result.resumen).toBe('Resumen no disponible temporalmente.');
      jest.restoreAllMocks();
    });

    it('throws when getPublicUrl returns no data', async () => {
      storageOps.getPublicUrl.mockReturnValue({ data: null });

      await expect(service.getPublicUrl(path)).rejects.toThrow(
        'Error obteniendo URL pública',
      );
    });
  });

  // ─── getResultadosPaciente ────────────────────────────────────────────────

  describe('getResultadosPaciente', () => {
    it('returns populated resultados for the given patient', async () => {
      const pacienteId = new Types.ObjectId().toString();
      const resultados = [
        { _id: new Types.ObjectId(), fileUrl: 'public/file.pdf' },
      ];
      resultadoModel.find.mockReturnValue(makePopulatable(resultados));

      const result = await service.getResultadosPaciente(pacienteId);

      expect(result).toBe(resultados);
      expect(resultadoModel.find).toHaveBeenCalledWith({
        paciente_ID: expect.any(Types.ObjectId),
      });
    });
  });

  // ─── getAllResumen ─────────────────────────────────────────────────────────

  describe('getAllResumen', () => {
    it('returns all resultados populated for the given medico', async () => {
      const medicoId = new Types.ObjectId().toString();
      const resultados = [
        { _id: new Types.ObjectId(), fileUrl: 'public/file.pdf' },
      ];
      resultadoModel.find.mockReturnValue(makePopulatable(resultados));

      const result = await service.getAllResumen(medicoId);

      expect(result).toBe(resultados);
      expect(resultadoModel.find).toHaveBeenCalledWith({
        medico_ID: expect.any(Types.ObjectId),
      });
    });
  });
});
