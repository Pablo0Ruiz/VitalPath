import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvConfig } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { GeminiModule } from './gemini/gemini.module';
import { SupabaseModule } from './supabase/supabase.module';
import { AppointmentModule } from './appointment/appointment.module';
import { MedicationsModule } from './medications/medications.module';
import { HospitalsModule } from './hospitals/hospitals.module';
import { GeminiToolsModule } from './gemini-tools/gemini-tools.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfig],
      validationSchema: JoiValidationSchema,
    }),

    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URI,
        dbName: process.env.MONGO_DB_NAME,
      }),
    }),
    AuthModule,

    CommonModule,

    UserModule,

    GeminiModule,

    SupabaseModule,

    AppointmentModule,

    MedicationsModule,

    HospitalsModule,

    GeminiToolsModule,
  ],
})
export class AppModule {}
