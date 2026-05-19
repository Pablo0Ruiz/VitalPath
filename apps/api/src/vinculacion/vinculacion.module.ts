import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from 'src/auth/auth.module';
import {
  VinculacionPacienteCuidador,
  VinculacionPacienteCuidadorSchema,
} from './entities/vinculacion.entity';
import { VinculacionService } from './vinculacion.service';
import { VinculacionController } from './vinculacion.controller';
import { User, UserSchema } from 'src/auth/entities/user.entity';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    MongooseModule.forFeature([
      {
        name: VinculacionPacienteCuidador.name,
        schema: VinculacionPacienteCuidadorSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [VinculacionController],
  providers: [VinculacionService],
  exports: [VinculacionService],
})
export class VinculacionModule {}
