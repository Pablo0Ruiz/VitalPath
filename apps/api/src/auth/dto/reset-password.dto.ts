import { IsString, MaxLength, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT token de recuperación',
  })
  @IsString()
  token: string;

  @ApiProperty({ example: 'Password123', minLength: 6, maxLength: 50 })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,50}$/, {
    message:
      'La contraseña debe tener una mayúscula, una minúscula y un número',
  })
  newPassword: string;
}
