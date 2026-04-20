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
import { User } from 'src/auth/entities/user.entity';
import { Doctor } from '../user/entities/doctor.entity';
import { Patient } from '../user/entities/patient.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly citaModel: Model<Appointment>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Doctor.name)
    private readonly doctorModel: Model<Doctor>,
    @InjectModel(Patient.name)
    private readonly patientModel: Model<Patient>,
  ) {}

  async createAppointment(
    userId: string,
    createAppointmentDto: CreateAppointmentDto,
  ) {
    const pacienteId = new Types.ObjectId(userId);
    const medicoId = new Types.ObjectId(createAppointmentDto.medico_ID);
    const appointment = await this.citaModel.create({
      paciente_ID: pacienteId,
      medico_ID: medicoId,
      centroSalud_ID: createAppointmentDto.centroSalud_ID,
      fecha: createAppointmentDto.fecha,
      hora: createAppointmentDto.hora,
      estado: CitaState.AGENDADA,
    });

    if (!appointment) {
      throw new Error('Error al crear la cita');
    }

    await Promise.all([
      this.patientModel.findOneAndUpdate(
        { user: userId },
        { $push: { citas: appointment._id } },
      ),
      this.doctorModel.findOneAndUpdate(
        { user: createAppointmentDto.medico_ID },
        { $push: { citas: appointment._id } },
      ),
    ]);

    return appointment;
  }

  async getAppointments(userId: string) {
    return this.citaModel
      .find({ paciente_ID: userId })
      .populate('medico_ID', 'name lastName')
      .populate('centroSalud_ID', 'nombre direccion')
      .sort({ fecha: 1, hora: 1 })
      .exec();
  }

  async getAppointmentById(userId: string, citaId: string) {
    if (!Types.ObjectId.isValid(citaId)) {
      throw new NotFoundException('La cita no existe');
    }

    const cita = await this.citaModel
      .findById(citaId)
      .populate('medico_ID', 'name lastName')
      .populate('centroSalud_ID', 'nombre direccion');

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
        { user: userId },
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
