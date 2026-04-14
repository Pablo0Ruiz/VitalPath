import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Auth()
  @Post()
  create(
    @GetUser('_id') userId: string,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    return this.appointmentService.createAppointment(
      userId,
      createAppointmentDto,
    );
  }

  @Auth()
  @Get()
  findAll(@GetUser('_id') userId: string) {
    return this.appointmentService.getAppointments(userId);
  }

  @Auth()
  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('_id') userId: string) {
    return this.appointmentService.getAppointmentById(userId, id);
  }

  @Auth()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @GetUser('_id') userId: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.updateAppointment(
      userId,
      id,
      updateAppointmentDto,
    );
  }
  @Auth()
  @Delete(':id')
  async cancelAppointment(
    @GetUser('_id') userId: string,
    @Param('id') id: string,
  ) {
    return this.appointmentService.cancelAppointment(userId, id);
  }
}
