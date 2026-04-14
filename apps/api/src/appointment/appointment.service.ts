import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CitaState } from 'src/appointment/dto/enum/cita-state.enum';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto';
import { Appointment } from './entities/appointment.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly citaModel: Model<Appointment>,
  ) {}

  async createAppointment(
    userId: string,
    createAppointmentDto: CreateAppointmentDto,
  ) {
    const appointment = await this.citaModel.create({
      paciente_ID: userId,
      medico_ID: createAppointmentDto.medico_ID,
      centroSalud_ID: createAppointmentDto.centroSalud_ID,
      fechaHora: new Date(createAppointmentDto.fechaHora),
      estado: CitaState.AGENDADA,
    });

    if (!appointment) {
      throw new Error('Error al crear la cita');
    }
    return appointment;
  }

  async getAppointments(userId: string) {
    return this.citaModel
      .find({ paciente_ID: userId })
      .sort({ fechaHora: 1 })
      .exec();
  }

  async getAppointmentById(userId: string, citaId: string) {
    if (!Types.ObjectId.isValid(citaId)) {
      throw new NotFoundException('La cita no existe');
    }

    const cita = await this.citaModel.findById(citaId);

    if (!cita) throw new NotFoundException('La cita no existe');
    if (cita.paciente_ID.toString() !== userId.toString()) {
      throw new ForbiddenException('No tienes permisos para ver esta cita');
    }

    return cita;
  }

  async updateAppointment(
    userId: string,
    citaId: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ) {
    const appointment = await this.getAppointmentById(userId, citaId);

    if (updateAppointmentDto.fechaHora)
      appointment.fechaHora = new Date(updateAppointmentDto.fechaHora);
    if (updateAppointmentDto.medico_ID)
      appointment.medico_ID = new Types.ObjectId(
        updateAppointmentDto.medico_ID,
      );
    if (updateAppointmentDto.centroSalud_ID)
      appointment.centroSalud_ID = new Types.ObjectId(
        updateAppointmentDto.centroSalud_ID,
      );
    if (updateAppointmentDto.estado)
      appointment.estado = updateAppointmentDto.estado;

    return appointment.save();
  }

  async cancelAppointment(userId: string, citaId: string) {
    const appointment = await this.getAppointmentById(userId, citaId);
    appointment.estado = CitaState.CANCELADA;
    return appointment.save();
  }
}
