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
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { UpdateCitaEstadoDto } from './dto/update-cita-estado.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserRoles } from 'src/auth/enum/user-role.enum';

@ApiTags('appointment')
@ApiBearerAuth('access-token')
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Auth()
  @Post()
  @ApiOperation({
    summary: 'Create a new appointment for the authenticated patient',
  })
  @ApiResponse({ status: 201, description: 'Appointment created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
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
  @ApiOperation({ summary: 'Get all appointments for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of appointments' })
  findAll(@GetUser('_id') userId: string) {
    return this.appointmentService.getAppointments(userId);
  }

  @Auth(UserRoles.TRABAJADOR_CENTRO)
  @Get('allCitas')
  @ApiOperation({ summary: 'Get all appointments (admin/worker view)' })
  @ApiResponse({ status: 200, description: 'List of all appointments' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — requires trabajador_centro role',
  })
  findAllAdmin() {
    return this.appointmentService.getAppointmentsAdministrator();
  }

  @Auth(UserRoles.MEDICO)
  @Get('allCitasMedico')
  @ApiOperation({
    summary: 'Get all appointments for the authenticated doctor',
  })
  @ApiResponse({ status: 200, description: 'List of doctor appointments' })
  @ApiResponse({ status: 403, description: 'Forbidden — requires medico role' })
  findAllMedico(@GetUser('_id') userId: string) {
    return this.appointmentService.getAppointmentsMedico(userId);
  }

  @Auth()
  @Get(':id')
  @ApiOperation({ summary: 'Get a single appointment by ID' })
  @ApiResponse({ status: 200, description: 'Appointment details' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  findOne(@Param('id') id: string, @GetUser('_id') userId: string) {
    return this.appointmentService.getAppointmentById(userId, id);
  }

  @Auth(UserRoles.TRABAJADOR_CENTRO)
  @Patch(':id/estado')
  @ApiOperation({ summary: 'Advance appointment state (worker only)' })
  @ApiResponse({ status: 200, description: 'State updated' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — requires trabajador_centro role',
  })
  avanzarEstado(
    @Param('id') id: string,
    @Body() updateCitaEstadoDto: UpdateCitaEstadoDto,
  ) {
    return this.appointmentService.updateEstadoWorker(
      id,
      updateCitaEstadoDto.estado,
    );
  }

  @Auth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update appointment details' })
  @ApiResponse({ status: 200, description: 'Appointment updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
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
  @ApiOperation({ summary: 'Cancel an appointment' })
  @ApiResponse({ status: 200, description: 'Appointment cancelled' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async cancelAppointment(
    @GetUser('_id') userId: string,
    @Param('id') id: string,
  ) {
    return this.appointmentService.cancelAppointment(userId, id);
  }
}
