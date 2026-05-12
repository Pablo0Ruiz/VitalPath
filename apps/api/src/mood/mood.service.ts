import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Mood } from './entities/mood.entity';
import { CreateMoodDto } from './dto/create-mood.dto';

@Injectable()
export class MoodService {
  constructor(
    @InjectModel(Mood.name) private readonly moodModel: Model<Mood>,
  ) {}

  async upsert(userId: string, dto: CreateMoodDto): Promise<Mood> {
    const day = new Date(dto.date);
    day.setUTCHours(0, 0, 0, 0);

    return this.moodModel
      .findOneAndUpdate(
        { userId: new Types.ObjectId(userId), date: day },
        { mood: dto.mood },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      )
      .exec();
  }
}
