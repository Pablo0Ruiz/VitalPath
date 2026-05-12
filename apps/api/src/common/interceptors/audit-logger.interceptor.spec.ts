import { AuditLoggerInterceptor } from './audit-logger.interceptor';
import { AuditService } from '../../audit/audit.service';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

const mockAuditService = {
  logAction: jest.fn(),
};

function buildContext(
  method: string,
  url: string,
  user: Record<string, string> | null,
): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        method,
        url,
        user,
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      }),
    }),
  } as unknown as ExecutionContext;
}

const mockHandler: CallHandler = {
  handle: () => of({}),
};

describe('AuditLoggerInterceptor', () => {
  let interceptor: AuditLoggerInterceptor;

  beforeEach(() => {
    jest.clearAllMocks();
    interceptor = new AuditLoggerInterceptor(
      mockAuditService as unknown as AuditService,
    );
  });

  describe('GET branch (VIEW_MEDICAL_DATA) — regression', () => {
    it('fires VIEW_MEDICAL_DATA for GET /patient', done => {
      const ctx = buildContext('GET', '/patient/123', { id: 'user1' });
      interceptor.intercept(ctx, mockHandler).subscribe({
        complete: () => {
          expect(mockAuditService.logAction).toHaveBeenCalledWith(
            'VIEW_MEDICAL_DATA',
            'user1',
            '/patient/123',
            '127.0.0.1',
            expect.stringContaining('test-agent'),
          );
          done();
        },
      });
    });

    it('does NOT fire WRITE_MEDICAL_DATA for GET /patient', done => {
      const ctx = buildContext('GET', '/patient/123', { id: 'user1' });
      interceptor.intercept(ctx, mockHandler).subscribe({
        complete: () => {
          const writeCalls = (
            mockAuditService.logAction as jest.Mock
          ).mock.calls.filter(
            ([action]: [string]) => action === 'WRITE_MEDICAL_DATA',
          );
          expect(writeCalls).toHaveLength(0);
          done();
        },
      });
    });
  });

  describe('WRITE branch (WRITE_MEDICAL_DATA)', () => {
    it('fires WRITE_MEDICAL_DATA for POST /appointment', done => {
      const ctx = buildContext('POST', '/appointment', { id: 'user2' });
      interceptor.intercept(ctx, mockHandler).subscribe({
        complete: () => {
          expect(mockAuditService.logAction).toHaveBeenCalledWith(
            'WRITE_MEDICAL_DATA',
            'user2',
            '/appointment',
            '127.0.0.1',
            expect.stringContaining('POST /appointment'),
          );
          done();
        },
      });
    });

    it('fires WRITE_MEDICAL_DATA for PATCH /auth/set-access-code/:id', done => {
      const ctx = buildContext('PATCH', '/auth/set-access-code/abc123', {
        id: 'user3',
      });
      interceptor.intercept(ctx, mockHandler).subscribe({
        complete: () => {
          expect(mockAuditService.logAction).toHaveBeenCalledWith(
            'WRITE_MEDICAL_DATA',
            'user3',
            '/auth/set-access-code/abc123',
            '127.0.0.1',
            expect.stringContaining('PATCH'),
          );
          done();
        },
      });
    });

    it('fires WRITE_MEDICAL_DATA for DELETE /medications', done => {
      const ctx = buildContext('DELETE', '/medications/123', { id: 'user4' });
      interceptor.intercept(ctx, mockHandler).subscribe({
        complete: () => {
          expect(mockAuditService.logAction).toHaveBeenCalledWith(
            'WRITE_MEDICAL_DATA',
            'user4',
            '/medications/123',
            '127.0.0.1',
            expect.stringContaining('DELETE'),
          );
          done();
        },
      });
    });

    it('does NOT fire for POST to non-allowlisted route', done => {
      const ctx = buildContext('POST', '/healthz', { id: 'user5' });
      interceptor.intercept(ctx, mockHandler).subscribe({
        complete: () => {
          expect(mockAuditService.logAction).not.toHaveBeenCalled();
          done();
        },
      });
    });

    it('does NOT fire when user is null', done => {
      const ctx = buildContext('POST', '/appointment', null);
      interceptor.intercept(ctx, mockHandler).subscribe({
        complete: () => {
          expect(mockAuditService.logAction).not.toHaveBeenCalled();
          done();
        },
      });
    });
  });
});
