import { Injectable } from '@nestjs/common';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Medication } from './entities/medication.entity';
import { User } from 'src/auth/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MedicationsService {
  constructor(
    @InjectModel(Medication.name)
    private readonly medicationModel: Model<Medication>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly userService: UserService,
  ) {}

  async createMedication(
    createMedicationDto: CreateMedicationDto,
    userId: string,
  ) {
    const medication = await this.medicationModel.create(createMedicationDto);
    if (!medication) throw new Error('Error al crear el medicamento');

    await this.userModel.findByIdAndUpdate(userId, {
      $push: { medications: medication._id },
    });

    return { medication, message: 'Medicamento añadido exitosamente' };
  }

  async findAllMedications(userId: string) {
    const user = await this.validateUserAndMedication(userId);

    const medications = await this.medicationModel.find({
      _id: { $in: user.medications },
    });
    if (!medications) throw new Error('Error al obtener los medicamentos');
    return medications;
  }

  async findOneMedication(userId: string, medicationId: string) {
    await this.validateUserAndMedication(userId, medicationId);

    const medication = await this.medicationModel.findById(medicationId);
    if (!medication) throw new Error('Error al obtener el medicamento');

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
    if (!medication) throw new Error('Error al actualizar el medicamento');
    return { medication, message: 'Medicamento actualizado exitosamente' };
  }

  async removeMedication(userId: string, medicationId: string) {
    await this.validateUserAndMedication(userId, medicationId);

    const medication =
      await this.medicationModel.findByIdAndDelete(medicationId);
    if (!medication) throw new Error('Error al eliminar el medicamento');

    return { message: 'Medicamento eliminado exitosamente' };
  }

  private async validateUserAndMedication(
    userId: string,
    medicationId?: string,
  ) {
    const user = await this.userService.getUserProfile(userId);
    if (!user) throw new Error('Error al obtener el perfil');

    if (medicationId) {
      const medicationUser = user.medications.map(m => m.toString());
      if (!medicationUser.includes(medicationId))
        throw new Error('Error al obtener el medicamento');
    }

    return user;
  }
}
