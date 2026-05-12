import { IsIn, IsISO8601, IsString } from 'class-validator';

export class CreateMoodDto {
  @IsString()
  @IsIn(['1', '2', '3', '4', '5'])
  mood: string;

  @IsISO8601()
  date: string;
}
