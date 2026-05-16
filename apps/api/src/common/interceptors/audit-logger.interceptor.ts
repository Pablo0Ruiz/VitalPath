import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../../audit/audit.service';

const WRITE_AUDIT_PREFIXES = [
  '/appointment',
  '/medications',
  '/auth/set-access-code',
  '/ai/chat-stream',
] as const;

const WRITE_METHODS = new Set(['POST', 'PATCH', 'DELETE', 'PUT']);

@Injectable()
export class AuditLoggerInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const method = request.method;
    const url = request.url;

    return next.handle().pipe(
      tap(() => {
        if (
          user &&
          method === 'GET' &&
          (url.includes('/patient') ||
            url.includes('/resultado/pacientes') ||
            url.includes('/get-pdf'))
        ) {
          this.auditService.logAction(
            'VIEW_MEDICAL_DATA',
            user.id || 'unknown_user',
            url,
            request.ip,
            `User agent: ${request.headers['user-agent']}`,
          );
        }

        if (
          user &&
          WRITE_METHODS.has(method) &&
          WRITE_AUDIT_PREFIXES.some(prefix => url.startsWith(prefix))
        ) {
          this.auditService.logAction(
            'WRITE_MEDICAL_DATA',
            user.id ?? user._id ?? 'unknown_user',
            url,
            request.ip,
            `${method} ${url} | UA: ${request.headers['user-agent']}`,
          );
        }
      }),
    );
  }
}
