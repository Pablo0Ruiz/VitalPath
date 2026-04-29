import {
  BadRequestException,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoleGuard } from './user-role.guard';
import { UserRoles } from '../enum/user-role.enum';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeContext = (user: { role: UserRoles } | undefined): ExecutionContext =>
  ({
    getHandler: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  }) as unknown as ExecutionContext;

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('UserRoleGuard', () => {
  let guard: UserRoleGuard;
  let reflectorGet: jest.Mock;

  beforeEach(() => {
    reflectorGet = jest.fn();
    const reflector = { get: reflectorGet } as unknown as Reflector;
    guard = new UserRoleGuard(reflector);
  });

  it('passes when no roles metadata is defined on the handler', () => {
    reflectorGet.mockReturnValue(undefined);

    expect(guard.canActivate(makeContext(undefined))).toBe(true);
  });

  it('passes when the roles metadata array is empty', () => {
    reflectorGet.mockReturnValue([]);

    expect(guard.canActivate(makeContext(undefined))).toBe(true);
  });

  it('throws BadRequestException when no user is attached to the request', () => {
    reflectorGet.mockReturnValue([UserRoles.MEDICO]);

    expect(() => guard.canActivate(makeContext(undefined))).toThrow(
      BadRequestException,
    );
  });

  it('returns true when the user role is in the allowed list', () => {
    reflectorGet.mockReturnValue([UserRoles.MEDICO]);

    expect(guard.canActivate(makeContext({ role: UserRoles.MEDICO }))).toBe(
      true,
    );
  });

  it('throws ForbiddenException when the user role is not in the allowed list', () => {
    reflectorGet.mockReturnValue([UserRoles.MEDICO]);

    expect(() =>
      guard.canActivate(makeContext({ role: UserRoles.PACIENTE })),
    ).toThrow(ForbiddenException);
  });
});
