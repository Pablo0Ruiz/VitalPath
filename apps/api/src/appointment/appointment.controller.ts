import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CreateAppointmentWorkerDto } from './dto/create-appointment-worker.dto';
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

  @Auth(
    UserRoles.PACIENTE,
    UserRoles.MEDICO,
    UserRoles.TRABAJADOR_CENTRO,
    UserRoles.ADMIN,
  )
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

  @Auth(UserRoles.TRABAJADOR_CENTRO, UserRoles.ADMIN)
  @Post('worker')
  @ApiOperation({
    summary: 'Schedule an appointment for a patient (worker/admin)',
  })
  @ApiResponse({ status: 201, description: 'Appointment created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — requires trabajador_centro or admin role',
  })
  createForPatient(@Body() dto: CreateAppointmentWorkerDto) {
    return this.appointmentService.createAppointmentForPatient(dto);
  }

  @Auth(UserRoles.TRABAJADOR_CENTRO, UserRoles.ADMIN)
  @Get('allCitas')
  @ApiOperation({ summary: 'Get all appointments (admin/worker view)' })
  @ApiResponse({ status: 200, description: 'List of all appointments' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — requires trabajador_centro or admin role',
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

  @Auth(UserRoles.CUIDADOR_FAMILIAR)
  @Get('cuidador')
  @ApiOperation({
    summary: "Get all appointments for the cuidador's linked patients",
  })
  @ApiResponse({
    status: 200,
    description: 'List of appointments for linked patients',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — CUIDADOR_FAMILIAR only',
  })
  findAllForCuidador(
    @GetUser('_id') cuidadorId: string,
    @Query('pacienteId') pacienteId?: string,
  ) {
    return this.appointmentService.getAppointmentsForCuidador(
      cuidadorId,
      pacienteId,
    );
  }

  @Auth(
    UserRoles.PACIENTE,
    UserRoles.MEDICO,
    UserRoles.TRABAJADOR_CENTRO,
    UserRoles.ADMIN,
    UserRoles.CUIDADOR_FAMILIAR,
  )
  @Get(':id')
  @ApiOperation({ summary: 'Get a single appointment by ID' })
  @ApiResponse({ status: 200, description: 'Appointment details' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  findOne(
    @Param('id') id: string,
    @GetUser('_id') userId: string,
    @GetUser('role') role: UserRoles,
  ) {
    return this.appointmentService.getAppointmentById(userId, id, role);
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

  @Auth(
    UserRoles.PACIENTE,
    UserRoles.MEDICO,
    UserRoles.TRABAJADOR_CENTRO,
    UserRoles.ADMIN,
  )
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

  @Auth(
    UserRoles.PACIENTE,
    UserRoles.MEDICO,
    UserRoles.TRABAJADOR_CENTRO,
    UserRoles.ADMIN,
  )
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

  @Auth(UserRoles.TRABAJADOR_CENTRO)
  @Patch(':id/worker')
  @ApiOperation({
    summary: 'Update appointment as worker (no ownership check)',
  })
  updateByWorker(@Param('id') id: string, @Body() dto: UpdateAppointmentDto) {
    return this.appointmentService.updateAppointmentByWorker(id, dto);
  }

  @Auth(UserRoles.TRABAJADOR_CENTRO)
  @Delete(':id/worker')
  @HttpCode(204)
  @ApiOperation({ summary: 'Cancel (hard-delete) appointment as worker' })
  async deleteByWorker(@Param('id') id: string): Promise<void> {
    await this.appointmentService.deleteAppointmentByWorker(id);
  }
}
