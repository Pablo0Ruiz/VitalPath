import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectModel(AuditLog.name)
    private readonly auditLogModel: Model<AuditLog>,
  ) {}

  async logAction(
    action: string,
    userId: string,
    resourceId: string,
    ipAddress?: string,
    details?: string,
  ) {
    try {
      await this.auditLogModel.create({
        action,
        userId,
        resourceId,
        ipAddress,
        details,
      });
    } catch (error) {
      this.logger.error('Fallo al guardar log de auditoría forense', error);
    }
  }
}
