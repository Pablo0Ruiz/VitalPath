export interface AuditLog {
  _id: string;
  action: string;
  userId: string;
  resourceId: string;
  ipAddress?: string;
  details?: string;
  createdAt: string;
}

export interface AuditLogQuery {
  userId?: string;
  action?: string;
  resourceId?: string;
  from?: string;
  to?: string;
  limit?: number;
}
