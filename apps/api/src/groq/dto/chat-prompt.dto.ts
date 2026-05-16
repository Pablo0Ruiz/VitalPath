import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

export class ChatPromptDto {
  @ApiProperty({
    description: 'User message text',
    example: 'What does this lab result mean?',
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiHideProperty()
  @IsArray()
  @IsOptional()
  files: Express.Multer.File[];

  @ApiProperty({
    description: 'Conversation UUID',
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  chatId: string;
}
