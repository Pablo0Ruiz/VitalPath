import { Module } from '@nestjs/common';
import { EmailService } from './email/email.service';

@Module({
  controllers: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class CommonModule {}
