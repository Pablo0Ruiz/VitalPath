import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SavePushTokenDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  token!: string | null;
}
