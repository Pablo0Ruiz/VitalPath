import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { SupabaseController } from './supabase.controller';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from './supabase.constants';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ResultadoEstudio,
  ResultadoEstudioSchema,
} from 'src/user/entities/resultado-estudio.entity';
import { AuthModule } from 'src/auth/auth.module';
import { GeminiModule } from 'src/gemini/gemini.module';

@Module({
  controllers: [SupabaseController],
  providers: [
    {
      provide: SUPABASE_CLIENT,
      useFactory: (): SupabaseClient => {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!url || !key) {
          throw new Error('Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
        }
        return createClient(url, key);
      },
    },
    SupabaseService,
  ],
  exports: [SupabaseService, SUPABASE_CLIENT],
  imports: [
    AuthModule,
    GeminiModule,
    MongooseModule.forFeature([
      {
        name: ResultadoEstudio.name,
        schema: ResultadoEstudioSchema,
      },
    ]),
  ],
})
export class SupabaseModule {}
