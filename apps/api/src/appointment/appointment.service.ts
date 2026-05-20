import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CitaState } from 'src/appointment/dto/enum/cita-state.enum';
import { CITA_ALLOWED_TRANSITIONS, CitaEstado } from '@repo/types';
import { User } from 'src/auth/entities/user.entity';
import { UserRoles } from 'src/auth/enum/user-role.enum';
import { Doctor } from '../user/entities/doctor.entity';
import { Patient } from '../user/entities/patient.entity';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto';
import { CreateAppointmentWorkerDto } from './dto/create-appointment-worker.dto';
import { Appointment } from './entities/appointment.entity';
import { PushNotificationsService } from '../push-notifications/push-notifications.service';
import { CITA_PUSH_COPY } from '../push-notifications/constants/cita-push-copy';
import { VinculacionService } from '../vinculacion/vinculacion.service';

type LeanMedico = { _id: Types.ObjectId; name: string; lastName: string };
type LeanCentro = { _id: Types.ObjectId; nombre: string; direccion: string };
type LeanCita = Omit<Appointment, 'medico_ID' | 'centroSalud_ID'> & {
  _id: Types.ObjectId;
  medico_ID: LeanMedico;
  centroSalud_ID: LeanCentro;
};

@Injectable()
export class AppointmentService {
  private readonly logger = new Logger(AppointmentService.name);

  constructor(
    @InjectModel(Appointment.name)
    private readonly citaModel: Model<Appointment>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Doctor.name)
    private readonly doctorModel: Model<Doctor>,
    @InjectModel(Patient.name)
    private readonly patientModel: Model<Patient>,
    private readonly pushService: PushNotificationsService,
    private readonly vinculacionService: VinculacionService,
  ) {}

  async createAppointment(
    userId: string,
    createAppointmentDto: CreateAppointmentDto,
  ) {
    const pacienteId = new Types.ObjectId(userId);
    const medicoId = new Types.ObjectId(createAppointmentDto.medico_ID);
    const centroSaludId = new Types.ObjectId(
      createAppointmentDto.centroSalud_ID,
    );

    const appointment = await this.citaModel.create({
      paciente_ID: pacienteId,
      medico_ID: medicoId,
      centroSalud_ID: centroSaludId,
      fecha: createAppointmentDto.fecha,
      hora: createAppointmentDto.hora,
      estado: CitaState.AGENDADA,
    });

    if (!appointment) {
      throw new Error('Error al crear la cita');
    }

    await Promise.all([
      this.patientModel.findOneAndUpdate(
        { user: pacienteId },
        { $push: { citas: appointment._id } },
      ),
      this.doctorModel.findOneAndUpdate(
        { user: medicoId },
        { $push: { citas: appointment._id } },
      ),
    ]);

    void this.notifyAgendada(appointment);

    return appointment;
  }

  async createAppointmentForPatient(
    createAppointmentDto: CreateAppointmentWorkerDto,
  ) {
    const pacienteId = new Types.ObjectId(createAppointmentDto.paciente_ID);
    const medicoId = new Types.ObjectId(createAppointmentDto.medico_ID);
    const centroSaludId = new Types.ObjectId(
      createAppointmentDto.centroSalud_ID,
    );

    const appointment = await this.citaModel.create({
      paciente_ID: pacienteId,
      medico_ID: medicoId,
      centroSalud_ID: centroSaludId,
      fecha: createAppointmentDto.fecha,
      hora: createAppointmentDto.hora,
      estado: CitaState.AGENDADA,
    });

    if (!appointment) {
      throw new Error('Error al crear la cita');
    }

    await Promise.all([
      this.patientModel.findOneAndUpdate(
        { user: pacienteId },
        { $push: { citas: appointment._id } },
      ),
      this.doctorModel.findOneAndUpdate(
        { user: medicoId },
        { $push: { citas: appointment._id } },
      ),
    ]);

    void this.notifyAgendada(appointment);

    return appointment;
  }

  async getAppointmentsAdministrator() {
    const citas = await this.citaModel
      .find()
      .populate('medico_ID', 'name lastName')
      .populate('centroSalud_ID', 'nombre direccion')
      .populate('paciente_ID', 'name lastName')
      .sort({ fecha: 1, hora: 1 })
      .lean()
      .exec();

    return this.enrichWithEspecialidad(citas as unknown as LeanCita[]);
  }

  async getAppointmentsMedico(userId: string) {
    const citas = await this.citaModel
      .find({ medico_ID: userId })
      .populate('medico_ID', 'name lastName')
      .populate('centroSalud_ID', 'nombre direccion')
      .populate('paciente_ID', 'name lastName')
      .sort({ fecha: 1, hora: 1 })
      .lean()
      .exec();

    return this.enrichWithEspecialidad(citas as unknown as LeanCita[]);
  }

  async getAppointments(userId: string) {
    const pacienteId = new Types.ObjectId(userId);
    const citas = await this.citaModel
      .find({ paciente_ID: pacienteId })
      .populate('medico_ID', 'name lastName')
      .populate('centroSalud_ID', 'nombre direccion')
      .sort({ fecha: 1, hora: 1 })
      .lean()
      .exec();

    return this.enrichWithEspecialidad(citas as unknown as LeanCita[]);
  }

  async getAppointmentById(userId: string, citaId: string, role: UserRoles) {
    if (!Types.ObjectId.isValid(citaId)) {
      throw new NotFoundException('La cita no existe');
    }

    const cita = await this.citaModel
      .findById(citaId)
      .populate('medico_ID', 'name lastName')
      .populate('centroSalud_ID', 'nombre direccion')
      .lean();

    if (!cita) throw new NotFoundException('La cita no existe');

    if (role === UserRoles.CUIDADOR_FAMILIAR) {
      const linked = await this.vinculacionService.isCuidadorLinkedToPaciente(
        userId,
        cita.paciente_ID.toString(),
      );
      if (!linked) {
        throw new ForbiddenException('No autorizado para ver esta cita');
      }
      const [enriched] = await this.enrichWithEspecialidad([
        cita,
      ] as unknown as LeanCita[]);
      return enriched;
    }

    if (
      role === UserRoles.PACIENTE &&
      cita.paciente_ID.toString() !== userId.toString()
    ) {
      throw new ForbiddenException('No tienes permisos para ver esta cita');
    }

    const [enriched] = await this.enrichWithEspecialidad([
      cita,
    ] as unknown as LeanCita[]);
    return enriched;
  }

  async getAppointmentsForCuidador(cuidadorId: string, pacienteId?: string) {
    const pacienteIds =
      await this.vinculacionService.getActivePacienteIdsForCuidador(cuidadorId);

    if (!pacienteIds.length) return [];

    const filter: Record<string, unknown> = {
      paciente_ID: { $in: pacienteIds.map(id => new Types.ObjectId(id)) },
    };

    if (pacienteId && Types.ObjectId.isValid(pacienteId)) {
      filter['paciente_ID'] = new Types.ObjectId(pacienteId);
    }

    const citas = await this.citaModel
      .find(filter)
      .populate('medico_ID', 'name lastName')
      .populate('centroSalud_ID', 'nombre direccion')
      .populate('paciente_ID', 'name lastName')
      .sort({ fecha: 1, hora: 1 })
      .lean()
      .exec();

    return this.enrichWithEspecialidad(citas as unknown as LeanCita[]);
  }

  private async enrichWithEspecialidad(citas: LeanCita[]) {
    if (!citas.length) return citas;

    const medicoIds = citas.map(c => c.medico_ID._id);
    const doctors = await this.doctorModel
      .find({ user: { $in: medicoIds } })
      .select('user especialidad')
      .lean();

    const specialtyMap = new Map(
      doctors.map(d => [d.user.toString(), d.especialidad]),
    );

    return citas.map(cita => ({
      ...cita,
      medico_ID: {
        ...cita.medico_ID,
        especialidad: specialtyMap.get(cita.medico_ID._id.toString()) ?? '',
      },
    }));
  }

  async updateAppointment(
    userId: string,
    citaId: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ) {
    const appointment = await this.citaModel.findById(citaId);
    if (!appointment) throw new NotFoundException('La cita no existe');
    if (appointment.paciente_ID.toString() !== userId.toString()) {
      throw new ForbiddenException(
        'No tienes permisos para modificar esta cita',
      );
    }

    if (updateAppointmentDto.fecha)
      appointment.fecha = updateAppointmentDto.fecha;
    if (updateAppointmentDto.hora) appointment.hora = updateAppointmentDto.hora;

    if (
      updateAppointmentDto.medico_ID &&
      updateAppointmentDto.medico_ID !== appointment.medico_ID.toString()
    ) {
      const oldMedicoId = appointment.medico_ID;
      const newMedicoId = new Types.ObjectId(updateAppointmentDto.medico_ID);

      await Promise.all([
        this.doctorModel.findOneAndUpdate(
          { user: oldMedicoId },
          { $pull: { citas: appointment._id } },
        ),
        this.doctorModel.findOneAndUpdate(
          { user: newMedicoId },
          { $push: { citas: appointment._id } },
        ),
      ]);

      appointment.medico_ID = newMedicoId;
    }

    if (updateAppointmentDto.estado === CitaState.CANCELADA) {
      await this.cancelAppointment(userId, citaId);
      return null;
    }

    if (updateAppointmentDto.centroSalud_ID)
      appointment.centroSalud_ID = new Types.ObjectId(
        updateAppointmentDto.centroSalud_ID,
      );
    if (updateAppointmentDto.estado)
      appointment.estado = updateAppointmentDto.estado;

    return appointment.save();
  }

  async getAppointmentByIdForStaff(citaId: string) {
    if (!Types.ObjectId.isValid(citaId)) {
      throw new NotFoundException('La cita no existe');
    }

    const cita = await this.citaModel
      .findById(citaId)
      .populate('paciente_ID', 'name lastName')
      .populate('medico_ID', 'name lastName')
      .populate('centroSalud_ID', 'nombre direccion')
      .lean();

    if (!cita) throw new NotFoundException('La cita no existe');

    const [enriched] = await this.enrichWithEspecialidad([
      cita,
    ] as unknown as LeanCita[]);
    return enriched;
  }

  async updateEstadoWorker(citaId: string, estado: CitaState) {
    const appointment = await this.citaModel.findById(citaId);
    if (!appointment) throw new NotFoundException('La cita no existe');

    const nextEstado =
      CITA_ALLOWED_TRANSITIONS[appointment.estado as CitaEstado];
    if (!nextEstado || nextEstado !== (estado as CitaEstado)) {
      throw new BadRequestException(
        `Transición inválida: ${appointment.estado} → ${estado}`,
      );
    }

    appointment.estado = estado;
    const saved = await appointment.save();
    void this.notifyStateChange(saved._id, saved.paciente_ID, estado);
    return saved;
  }

  private async notifyStateChange(
    citaId: Types.ObjectId,
    pacienteId: Types.ObjectId,
    estado: CitaState,
  ): Promise<void> {
    try {
      const copy = CITA_PUSH_COPY[estado];
      if (!copy) return;

      const patient = await this.userModel
        .findById(pacienteId)
        .select('+expoPushToken')
        .lean();

      const cuidadorTokens =
        await this.vinculacionService.getActiveTokensForPaciente(
          pacienteId.toString(),
        );

      const tokens = [patient?.expoPushToken, ...cuidadorTokens].filter(
        Boolean,
      ) as string[];
      if (tokens.length === 0) return;

      const bodyText =
        typeof copy.body === 'function'
          ? (copy.body as (cita: { _id: Types.ObjectId }) => string)({
              _id: citaId,
            })
          : copy.body;

      await this.pushService.sendPushNotification({
        tokens,
        title: copy.title,
        body: bodyText,
        data: { type: 'cita_state_change', citaId: String(citaId) },
      });
    } catch (error) {
      this.logger.warn('notifyStateChange failed (non-critical):', error);
    }
  }

  private async notifyAgendada(cita: Appointment): Promise<void> {
    try {
      const copy = CITA_PUSH_COPY[CitaState.AGENDADA];
      if (!copy) return;

      const patient = await this.userModel
        .findById(cita.paciente_ID)
        .select('+expoPushToken')
        .lean();

      const cuidadorTokens =
        await this.vinculacionService.getActiveTokensForPaciente(
          cita.paciente_ID.toString(),
        );

      const tokens = [patient?.expoPushToken, ...cuidadorTokens].filter(
        Boolean,
      ) as string[];
      if (tokens.length === 0) return;

      const citaId = (cita._id as Types.ObjectId).toString();

      const bodyText =
        typeof copy.body === 'function'
          ? (copy.body as (cita: Appointment) => string)(cita)
          : copy.body;

      void this.pushService.sendPushNotification({
        tokens,
        title: copy.title,
        body: bodyText,
        data: { type: 'AGENDADA', citaId },
      });
    } catch (error) {
      this.logger.warn('notifyAgendada failed (non-critical):', error);
    }
  }

  async cancelAppointment(userId: string, citaId: string) {
    const appointment = await this.citaModel.findById(citaId);
    if (!appointment) throw new NotFoundException('La cita no existe');
    if (appointment.paciente_ID.toString() !== userId.toString()) {
      throw new ForbiddenException(
        'No tienes permisos para cancelar esta cita',
      );
    }

    await Promise.all([
      this.patientModel.findOneAndUpdate(
        { user: new Types.ObjectId(userId) },
        { $pull: { citas: appointment._id } },
      ),
      this.doctorModel.findOneAndUpdate(
        { user: appointment.medico_ID },
        { $pull: { citas: appointment._id } },
      ),
    ]);

    await this.citaModel.findByIdAndDelete(citaId);
  }

  async updateAppointmentByWorker(
    citaId: string,
    dto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    if (!Types.ObjectId.isValid(citaId)) {
      throw new NotFoundException('La cita no existe');
    }
    const appointment = await this.citaModel.findById(citaId);
    if (!appointment) throw new NotFoundException('La cita no existe');

    if (dto.fecha) appointment.fecha = dto.fecha;
    if (dto.hora) appointment.hora = dto.hora;

    if (dto.medico_ID && dto.medico_ID !== appointment.medico_ID.toString()) {
      const oldMedicoId = appointment.medico_ID;
      const newMedicoId = new Types.ObjectId(dto.medico_ID);
      await Promise.all([
        this.doctorModel.findOneAndUpdate(
          { user: oldMedicoId },
          { $pull: { citas: appointment._id } },
        ),
        this.doctorModel.findOneAndUpdate(
          { user: newMedicoId },
          { $push: { citas: appointment._id } },
        ),
      ]);
      appointment.medico_ID = newMedicoId;
    }

    if (dto.centroSalud_ID) {
      appointment.centroSalud_ID = new Types.ObjectId(dto.centroSalud_ID);
    }
    if (dto.estado) appointment.estado = dto.estado;

    return appointment.save();
  }

  async deleteAppointmentByWorker(citaId: string): Promise<void> {
    if (!Types.ObjectId.isValid(citaId)) {
      throw new NotFoundException('La cita no existe');
    }
    const appointment = await this.citaModel.findById(citaId);
    if (!appointment) throw new NotFoundException('La cita no existe');

    await Promise.all([
      this.patientModel.findOneAndUpdate(
        { user: appointment.paciente_ID },
        { $pull: { citas: appointment._id } },
      ),
      this.doctorModel.findOneAndUpdate(
        { user: appointment.medico_ID },
        { $pull: { citas: appointment._id } },
      ),
    ]);

    await this.citaModel.findByIdAndDelete(citaId);
  }
}
