import { Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRoles } from 'src/auth/enum/user-role.enum';
import { StatsService } from './stats.service';
import { StatsSummaryDto } from './dto/stats-summary.dto';

@ApiTags('stats')
@ApiBearerAuth('access-token')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Auth(UserRoles.ADMIN, UserRoles.TRABAJADOR_CENTRO)
  @Get('summary')
  @ApiOperation({ summary: 'Get aggregated platform statistics' })
  @ApiResponse({
    status: 200,
    description: 'Platform statistics summary',
    type: StatsSummaryDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — requires admin or trabajador_centro role',
  })
  getSummary(): Promise<StatsSummaryDto> {
    return this.statsService.getSummary();
  }
}
