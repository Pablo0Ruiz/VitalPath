import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { MedicationsService } from './medications.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@ApiTags('medications')
@ApiBearerAuth('access-token')
@Controller('medications')
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @Auth()
  @Post()
  @ApiOperation({ summary: 'Create a medication for the authenticated user' })
  @ApiResponse({ status: 201, description: 'Medication created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
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
  @ApiOperation({ summary: 'Get all medications for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of medications' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  findAll(@GetUser('_id') userId: string) {
    return this.medicationsService.findAllMedications(userId);
  }

  @Auth()
  @Get(':id')
  @ApiOperation({ summary: 'Get a single medication by ID' })
  @ApiResponse({ status: 200, description: 'Medication details' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  @ApiResponse({ status: 404, description: 'Medication not found' })
  findOne(@Param('id') id: string, @GetUser('_id') userId: string) {
    return this.medicationsService.findOneMedication(userId, id);
  }

  @Auth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a medication' })
  @ApiResponse({ status: 200, description: 'Medication updated' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
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
  @ApiOperation({ summary: 'Delete a medication' })
  @ApiResponse({ status: 200, description: 'Medication deleted' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  remove(@Param('id') id: string, @GetUser('_id') userId: string) {
    return this.medicationsService.removeMedication(userId, id);
  }
}
