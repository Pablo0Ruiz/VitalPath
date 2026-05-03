import { Body, Controller, Get, Post, Param } from '@nestjs/common';

import { HospitalsService } from './hospitals.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateHospitalDto } from './dto/create-hospital.dto';

@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Post()
  createHospital(@Body() dto: CreateHospitalDto) {
    return this.hospitalsService.createHospital(dto);
  }

  @Post('doctors/:doctorId/invite')
  inviteDoctor(
    @Param('doctorId') doctorId: string,
    @Body('hospitalId') hospitalId?: string,
  ) {
    return this.hospitalsService.inviteDoctor(doctorId, hospitalId);
  }

  @Auth()
  @Get('doctors')
  async getDoctors() {
    return this.hospitalsService.getDoctors();
  }
}
