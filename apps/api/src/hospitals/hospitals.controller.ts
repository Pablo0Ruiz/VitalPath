import { Controller, Post, Param } from '@nestjs/common';
import { HospitalsService } from './hospitals.service';

@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Post('doctors/:doctorId/invite')
  inviteDoctor(@Param('doctorId') doctorId: string) {
    return this.hospitalsService.inviteDoctor(doctorId);
  }
}
