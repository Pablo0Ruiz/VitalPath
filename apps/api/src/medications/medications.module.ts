import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { MedicationsService } from './medications.service';
import { MedicationsController } from './medications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Medication, MedicationSchema } from './entities/medication.entity';
import { User, UserSchema } from 'src/auth/entities/user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    MongooseModule.forFeature([
      { name: Medication.name, schema: MedicationSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [MedicationsController],
  providers: [MedicationsService],
})
export class MedicationsModule {}
