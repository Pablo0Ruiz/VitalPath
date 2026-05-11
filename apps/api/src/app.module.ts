import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvConfig } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { GroqModule } from './groq/groq.module';
import { SupabaseModule } from './supabase/supabase.module';
import { AppointmentModule } from './appointment/appointment.module';
import { MedicationsModule } from './medications/medications.module';
import { HospitalsModule } from './hospitals/hospitals.module';
import { GroqToolsModule } from './groq-tools/groq-tools.module';
import { AuditModule } from './audit/audit.module';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { AuditLoggerInterceptor } from './common/interceptors/audit-logger.interceptor';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

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

    GroqModule,

    SupabaseModule,

    AppointmentModule,

    MedicationsModule,

    HospitalsModule,

    GroqToolsModule,

    AuditModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 50,
      },
    ]),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLoggerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
