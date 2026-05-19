import { Controller, Get, Query } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRoles } from 'src/auth/enum/user-role.enum';
import { AuditService } from './audit.service';
import { GetAuditLogsQueryDto } from './dto/get-audit-logs-query.dto';
import { AuditLog } from './entities/audit-log.entity';

@Controller('audit-logs')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Auth(UserRoles.ADMIN)
  @Get()
  findAll(@Query() query: GetAuditLogsQueryDto): Promise<AuditLog[]> {
    return this.auditService.findAll(query);
  }
}
