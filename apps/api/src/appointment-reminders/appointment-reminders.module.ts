import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Appointment,
  AppointmentSchema,
} from 'src/appointment/entities/appointment.entity';
import { User, UserSchema } from 'src/auth/entities/user.entity';
import { PushNotificationsModule } from 'src/push-notifications/push-notifications.module';
import { AppointmentRemindersService } from './appointment-reminders.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: User.name, schema: UserSchema },
    ]),
    PushNotificationsModule,
  ],
  providers: [AppointmentRemindersService],
})
export class AppointmentRemindersModule {}
