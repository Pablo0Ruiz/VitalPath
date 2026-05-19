import { Body, Controller, Get, Patch, Post, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { HospitalsService } from './hospitals.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRoles } from 'src/auth/enum/user-role.enum';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateDoctorScheduleDto } from './dto/update-doctor-schedule.dto';

@ApiTags('hospitals')
@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Post()
  @Auth(UserRoles.ADMIN, UserRoles.TRABAJADOR_CENTRO)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a hospital' })
  @ApiResponse({ status: 201, description: 'Hospital created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  @ApiResponse({ status: 403, description: 'Insufficient role' })
  createHospital(@Body() dto: CreateHospitalDto) {
    return this.hospitalsService.createHospital(dto);
  }

  @Post('doctors/:doctorId/invite')
  @Auth(UserRoles.ADMIN, UserRoles.TRABAJADOR_CENTRO)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Invite a doctor to a hospital' })
  @ApiResponse({ status: 201, description: 'Doctor invited successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  @ApiResponse({ status: 403, description: 'Insufficient role' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        hospitalId: {
          type: 'string',
          description: 'Optional hospital id to bind',
        },
      },
    },
  })
  inviteDoctor(
    @Param('doctorId') doctorId: string,
    @Body('hospitalId') hospitalId?: string,
  ) {
    return this.hospitalsService.inviteDoctor(doctorId, hospitalId);
  }

  @Auth()
  @Get('doctors')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all doctors registered in the system' })
  @ApiResponse({ status: 200, description: 'List of doctors' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  async getDoctors() {
    return this.hospitalsService.getDoctors();
  }

  @Auth(UserRoles.TRABAJADOR_CENTRO, UserRoles.ADMIN)
  @Patch('doctors/:doctorUserId/schedule')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Full-replace doctor availability slots' })
  @ApiResponse({ status: 200, description: 'Updated doctor document' })
  @ApiResponse({ status: 400, description: 'Invalid slot format' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  @ApiResponse({ status: 403, description: 'Insufficient role' })
  @ApiResponse({ status: 404, description: 'Doctor not found' })
  updateSchedule(
    @Param('doctorUserId') doctorUserId: string,
    @Body() dto: UpdateDoctorScheduleDto,
  ) {
    return this.hospitalsService.updateDoctorSchedule(doctorUserId, dto.slots);
  }
}
