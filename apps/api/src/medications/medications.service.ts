import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Medication } from './entities/medication.entity';
import { UserService } from 'src/user/user.service';

import { Patient } from 'src/user/entities/patient.entity';

@Injectable()
export class MedicationsService {
  constructor(
    @InjectModel(Medication.name)
    private readonly medicationModel: Model<Medication>,
    @InjectModel(Patient.name)
    private readonly patientModel: Model<Patient>,
    private readonly userService: UserService,
  ) {}

  async createMedication(
    createMedicationDto: CreateMedicationDto,
    userId: string,
  ) {
    const medication = await this.medicationModel.create(createMedicationDto);
    if (!medication)
      throw new InternalServerErrorException('Error al crear el medicamento');

    await this.patientModel.findOneAndUpdate(
      { user: userId },
      { $push: { medications: medication._id } },
    );

    return { medication, message: 'Medicamento añadido exitosamente' };
  }

  async findAllMedications(userId: string) {
    const user = await this.validateUserAndMedication(userId);
    return user.profile.medications;
  }

  async findOneMedication(userId: string, medicationId: string) {
    await this.validateUserAndMedication(userId, medicationId);

    const medication = await this.medicationModel.findById(medicationId);
    if (!medication) throw new NotFoundException('Medicamento no encontrado');

    return medication;
  }

  async updateMedication(
    userId: string,
    medicationId: string,
    updateMedicationDto: UpdateMedicationDto,
  ) {
    await this.validateUserAndMedication(userId, medicationId);

    const medication = await this.medicationModel.findByIdAndUpdate(
      medicationId,
      updateMedicationDto,
      { new: true },
    );
    if (!medication)
      throw new NotFoundException('Error al actualizar el medicamento');

    return { medication, message: 'Medicamento actualizado exitosamente' };
  }

  async removeMedication(userId: string, medicationId: string) {
    await this.validateUserAndMedication(userId, medicationId);

    const medication =
      await this.medicationModel.findByIdAndDelete(medicationId);
    if (!medication)
      throw new NotFoundException('Error al eliminar el medicamento');

    await this.patientModel.findOneAndUpdate(
      { user: userId },
      { $pull: { medications: medicationId } },
    );
    return { message: 'Medicamento eliminado exitosamente' };
  }

  private async validateUserAndMedication(
    userId: string,
    medicationId?: string,
  ) {
    const user = await this.userService.getUserProfile(userId);
    if (!user || !user.profile)
      throw new NotFoundException('Perfil de paciente no encontrado');

    if (medicationId && user.profile.medications) {
      const hasMedication = user.profile.medications.some(
        med => med._id.toString() === medicationId,
      );

      if (!hasMedication) {
        throw new ForbiddenException(
          'No tienes permiso para acceder a este medicamento',
        );
      }
    }

    return user;
  }
}
