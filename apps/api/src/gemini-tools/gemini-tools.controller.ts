import { Controller } from '@nestjs/common';
import { GeminiToolsService } from './gemini-tools.service';

@Controller('gemini-tools')
export class GeminiToolsController {
  constructor(private readonly geminiToolsService: GeminiToolsService) {}
}
