import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CitaState } from 'src/appointment/dto/enum/cita-state.enum';
import { User } from 'src/auth/entities/user.entity';
import { Appointment } from './entities/appointment.entity';
import { PushNotificationsService } from '../push-notifications/push-notifications.service';
import { CITA_PUSH_COPY } from '../push-notifications/constants/cita-push-copy';
import { VinculacionService } from '../vinculacion/vinculacion.service';

@Injectable()
export class AppointmentNotificationService {
  private readonly logger = new Logger(AppointmentNotificationService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly pushService: PushNotificationsService,
    private readonly vinculacionService: VinculacionService,
  ) {}

  async notifyAgendada(cita: Appointment): Promise<void> {
    try {
      const copy = CITA_PUSH_COPY[CitaState.AGENDADA];
      if (!copy) return;

      const patient = await this.userModel
        .findById(cita.paciente_ID)
        .select('+expoPushToken')
        .lean();

      const cuidadorTokens =
        await this.vinculacionService.getActiveTokensForPaciente(
          cita.paciente_ID.toString(),
        );

      const tokens = [patient?.expoPushToken, ...cuidadorTokens].filter(
        Boolean,
      ) as string[];
      if (tokens.length === 0) return;

      const citaId = (cita._id as Types.ObjectId).toString();

      const bodyText =
        typeof copy.body === 'function'
          ? (copy.body as (cita: Appointment) => string)(cita)
          : copy.body;

      void this.pushService.sendPushNotification({
        tokens,
        title: copy.title,
        body: bodyText,
        data: { type: 'AGENDADA', citaId },
      });
    } catch (error) {
      this.logger.warn('notifyAgendada failed (non-critical):', error);
    }
  }

  async notifyStateChange(
    citaId: Types.ObjectId,
    pacienteId: Types.ObjectId,
    estado: CitaState,
  ): Promise<void> {
    try {
      const copy = CITA_PUSH_COPY[estado];
      if (!copy) return;

      const patient = await this.userModel
        .findById(pacienteId)
        .select('+expoPushToken')
        .lean();

      const cuidadorTokens =
        await this.vinculacionService.getActiveTokensForPaciente(
          pacienteId.toString(),
        );

      const tokens = [patient?.expoPushToken, ...cuidadorTokens].filter(
        Boolean,
      ) as string[];
      if (tokens.length === 0) return;

      const bodyText =
        typeof copy.body === 'function'
          ? (copy.body as (cita: { _id: Types.ObjectId }) => string)({
              _id: citaId,
            })
          : copy.body;

      await this.pushService.sendPushNotification({
        tokens,
        title: copy.title,
        body: bodyText,
        data: { type: 'cita_state_change', citaId: String(citaId) },
      });
    } catch (error) {
      this.logger.warn('notifyStateChange failed (non-critical):', error);
    }
  }
}
