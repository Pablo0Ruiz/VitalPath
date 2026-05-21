import { renderHook } from '@testing-library/react-native';

// Mutable state — prefixed with `mock` so jest hoisting allows it
let mockUser: { _id: string; role?: string } | null = null;

jest.mock('@/src/stores/auth', () => ({
  useAuthStore: (selector: (s: { user: typeof mockUser }) => unknown) =>
    selector({ user: mockUser }),
}));

import { useRole } from '../useRole';

describe('useRole', () => {
  beforeEach(() => {
    mockUser = null;
  });

  it('returns "medico" when user role is medico', () => {
    mockUser = { _id: 'user-1', role: 'medico' };
    const { result } = renderHook(() => useRole());
    expect(result.current).toBe('medico');
  });

  it('returns "paciente" when user role is paciente', () => {
    mockUser = { _id: 'user-2', role: 'paciente' };
    const { result } = renderHook(() => useRole());
    expect(result.current).toBe('paciente');
  });

  it('returns "cuidador_familiar" when user role is cuidador_familiar', () => {
    mockUser = { _id: 'user-3', role: 'cuidador_familiar' };
    const { result } = renderHook(() => useRole());
    expect(result.current).toBe('cuidador_familiar');
  });

  it('returns "admin" when user role is admin', () => {
    mockUser = { _id: 'user-4', role: 'admin' };
    const { result } = renderHook(() => useRole());
    expect(result.current).toBe('admin');
  });

  it('returns "trabajador_centro" when user role is trabajador_centro', () => {
    mockUser = { _id: 'user-5', role: 'trabajador_centro' };
    const { result } = renderHook(() => useRole());
    expect(result.current).toBe('trabajador_centro');
  });

  it('returns null when user is null', () => {
    mockUser = null;
    const { result } = renderHook(() => useRole());
    expect(result.current).toBeNull();
  });

  it('returns null when user has no role', () => {
    mockUser = { _id: 'user-6' };
    const { result } = renderHook(() => useRole());
    expect(result.current).toBeNull();
  });

  it('normalizes uppercase role — returns "medico" for "MEDICO"', () => {
    mockUser = { _id: 'user-7', role: 'MEDICO' };
    const { result } = renderHook(() => useRole());
    expect(result.current).toBe('medico');
  });

  it('normalizes uppercase CUIDADOR_FAMILIAR to cuidador_familiar', () => {
    mockUser = { _id: 'user-8', role: 'CUIDADOR_FAMILIAR' };
    const { result } = renderHook(() => useRole());
    expect(result.current).toBe('cuidador_familiar');
  });

  it('returns null for unknown role string', () => {
    mockUser = { _id: 'user-9', role: 'superadmin' };
    const { result } = renderHook(() => useRole());
    expect(result.current).toBeNull();
  });
});
