import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Appointment } from 'src/appointment/entities/appointment.entity';
import { User } from 'src/auth/entities/user.entity';
import { CitaState } from 'src/appointment/dto/enum/cita-state.enum';
import { PushNotificationsService } from 'src/push-notifications/push-notifications.service';
import { tomorrowInTz } from './tz.helper';

@Injectable()
export class AppointmentRemindersService {
  private readonly logger = new Logger(AppointmentRemindersService.name);

  constructor(
    @InjectModel(Appointment.name)
    private readonly citaModel: Model<Appointment>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly pushService: PushNotificationsService,
  ) {}

  @Cron('0 9 * * *', {
    timeZone: 'Europe/Madrid',
    name: 'appointment-reminders-madrid',
  })
  async sendMadridReminders(): Promise<void> {
    await this.runForTz('Europe/Madrid');
  }

  private async runForTz(tz: string): Promise<void> {
    const tomorrow = tomorrowInTz(tz);
    this.logger.log(
      `[${tz}] Running appointment reminders for fecha: ${tomorrow}`,
    );

    const citas = await this.citaModel.find({
      fecha: tomorrow,
      estado: CitaState.AGENDADA,
      $or: [{ reminderSentAt: null }, { reminderSentAt: { $exists: false } }],
    });

    this.logger.log(`[${tz}] Found ${citas.length} cita(s) to remind`);

    for (const cita of citas) {
      try {
        const patient = await this.userModel
          .findById(cita.paciente_ID)
          .select('+expoPushToken');

        if (!patient?.expoPushToken) {
          continue;
        }

        await this.pushService.sendPushNotification({
          tokens: [patient.expoPushToken],
          title: 'Recordatorio de cita',
          body: 'Tenés una cita mañana. ¡No la olvides!',
          data: { type: 'reminder_24h', citaId: String(cita._id) },
        });

        await this.citaModel.findByIdAndUpdate(cita._id, {
          $set: { reminderSentAt: new Date() },
        });
      } catch (err) {
        this.logger.error(`Reminder failed for cita ${String(cita._id)}:`, err);
      }
    }
  }
}
