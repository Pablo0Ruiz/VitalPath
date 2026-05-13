import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { HospitalsService } from './hospitals.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateHospitalDto } from './dto/create-hospital.dto';

@ApiTags('hospitals')
@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a hospital',
    description:
      'PUBLIC endpoint — pending auth gate (security debt, tracked separately).',
  })
  @ApiResponse({ status: 201, description: 'Hospital created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  createHospital(@Body() dto: CreateHospitalDto) {
    return this.hospitalsService.createHospital(dto);
  }

  @Post('doctors/:doctorId/invite')
  @ApiOperation({
    summary: 'Invite a doctor to a hospital',
    description:
      'PUBLIC endpoint — pending auth gate (security debt, tracked separately).',
  })
  @ApiResponse({ status: 201, description: 'Doctor invited successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
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
}
