import { Controller, Post, Param, Get } from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRoles } from 'src/auth/enum/user-role.enum';

@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Post('doctors/:doctorId/invite')
  inviteDoctor(@Param('doctorId') doctorId: string) {
    return this.hospitalsService.inviteDoctor(doctorId);
  }
  @Auth(UserRoles.ADMIN, UserRoles.TRABAJADOR_CENTRO)
  @Get('doctors')
  async getDoctors() {
    const doctors = await this.hospitalsService.getDoctors();
    return doctors;
  }
}
