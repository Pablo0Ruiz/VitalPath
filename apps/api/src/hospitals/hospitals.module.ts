import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HospitalsService } from './hospitals.service';
import { HospitalsController } from './hospitals.controller';
import { AuthModule } from '../auth/auth.module';
import {
  CentroSalud,
  CentroSaludSchema,
} from '../user/entities/centro-salud.entity';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: CentroSalud.name, schema: CentroSaludSchema },
    ]),
  ],
  controllers: [HospitalsController],
  providers: [HospitalsService],
  exports: [HospitalsService],
})
export class HospitalsModule {}
