import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MedicationsService } from './medications.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('medications')
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @Auth()
  @Post()
  create(
    @Body() createMedicationDto: CreateMedicationDto,
    @GetUser('_id') userId: string,
  ) {
    return this.medicationsService.createMedication(
      createMedicationDto,
      userId,
    );
  }

  @Auth()
  @Get()
  findAll(@GetUser('_id') userId: string) {
    return this.medicationsService.findAllMedications(userId);
  }

  @Auth()
  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('_id') userId: string) {
    return this.medicationsService.findOneMedication(userId, id);
  }

  @Auth()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMedicationDto: UpdateMedicationDto,
    @GetUser('_id') userId: string,
  ) {
    return this.medicationsService.updateMedication(
      userId,
      id,
      updateMedicationDto,
    );
  }

  @Auth()
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('_id') userId: string) {
    return this.medicationsService.removeMedication(userId, id);
  }
}
