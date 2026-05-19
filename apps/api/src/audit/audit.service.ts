import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { QueryFilter } from 'mongoose';
import { AuditLog } from './entities/audit-log.entity';
import { GetAuditLogsQueryDto } from './dto/get-audit-logs-query.dto';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectModel(AuditLog.name)
    private readonly auditLogModel: Model<AuditLog>,
  ) {}

  async findAll(query: GetAuditLogsQueryDto): Promise<AuditLog[]> {
    const filter: QueryFilter<AuditLog> = {};
    if (query.userId) filter.userId = query.userId;
    if (query.action) filter.action = query.action;
    if (query.resourceId) filter.resourceId = query.resourceId;
    if (query.from || query.to) {
      filter.createdAt = {};
      if (query.from) filter.createdAt.$gte = query.from;
      if (query.to) filter.createdAt.$lte = query.to;
    }
    return this.auditLogModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(query.limit ?? 200)
      .lean()
      .exec();
  }

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
