import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Mood, MoodSchema } from './entities/mood.entity';
import { MoodService } from './mood.service';
import { MoodController } from './mood.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Mood.name, schema: MoodSchema }]),
    AuthModule,
  ],
  controllers: [MoodController],
  providers: [MoodService],
})
export class MoodModule {}
