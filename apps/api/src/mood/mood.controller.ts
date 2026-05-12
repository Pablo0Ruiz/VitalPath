import { Body, Controller, Post } from '@nestjs/common';
import { MoodService } from './mood.service';
import { CreateMoodDto } from './dto/create-mood.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('mood')
export class MoodController {
  constructor(private readonly moodService: MoodService) {}

  @Auth()
  @Post()
  upsert(@GetUser('_id') userId: string, @Body() dto: CreateMoodDto) {
    return this.moodService.upsert(userId, dto);
  }
}
