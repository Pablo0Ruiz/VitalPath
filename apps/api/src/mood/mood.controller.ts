import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { MoodService } from './mood.service';
import { CreateMoodDto } from './dto/create-mood.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@ApiTags('mood')
@ApiBearerAuth('access-token')
@Controller('mood')
export class MoodController {
  constructor(private readonly moodService: MoodService) {}

  @Auth()
  @Post()
  @ApiOperation({
    summary: 'Upsert daily mood check-in for the authenticated user',
  })
  @ApiResponse({ status: 201, description: 'Mood recorded or updated' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  upsert(@GetUser('_id') userId: string, @Body() dto: CreateMoodDto) {
    return this.moodService.upsert(userId, dto);
  }
}
