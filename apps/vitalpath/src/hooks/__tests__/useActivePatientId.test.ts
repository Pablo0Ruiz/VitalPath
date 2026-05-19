import { renderHook } from '@testing-library/react-native';

// Mutable state — prefixed with `mock` so jest hoisting allows it
let mockUser: { _id: string; role: string } | null = null;
let mockActivePacienteId: string | null = null;

jest.mock('@/src/stores/auth', () => ({
  useAuthStore: (selector: (s: { user: typeof mockUser }) => unknown) =>
    selector({ user: mockUser }),
}));

jest.mock('@/src/stores/activePaciente', () => ({
  useActivePacienteStore: (
    selector: (s: { activePacienteId: typeof mockActivePacienteId }) => unknown,
  ) => selector({ activePacienteId: mockActivePacienteId }),
}));

import { useActivePatientId } from '../useActivePatientId';

describe('useActivePatientId', () => {
  beforeEach(() => {
    mockUser = null;
    mockActivePacienteId = null;
  });

  describe('when user is PACIENTE', () => {
    it('returns user._id as patientId', () => {
      mockUser = { _id: 'user-123', role: 'PACIENTE' };

      const { result } = renderHook(() => useActivePatientId());

      expect(result.current.patientId).toBe('user-123');
      expect(result.current.isCuidador).toBe(false);
      expect(result.current.needsSelection).toBe(false);
    });

    it('does not expose activePacienteId even if store has one', () => {
      mockUser = { _id: 'user-456', role: 'PACIENTE' };
      mockActivePacienteId = 'some-other-id';

      const { result } = renderHook(() => useActivePatientId());

      expect(result.current.patientId).toBe('user-456');
    });
  });

  describe('when user is CUIDADOR_FAMILIAR', () => {
    it('returns activePacienteId when set', () => {
      mockUser = { _id: 'cuidador-1', role: 'CUIDADOR_FAMILIAR' };
      mockActivePacienteId = 'paciente-999';

      const { result } = renderHook(() => useActivePatientId());

      expect(result.current.patientId).toBe('paciente-999');
      expect(result.current.isCuidador).toBe(true);
      expect(result.current.needsSelection).toBe(false);
    });

    it('returns null when no active patient selected', () => {
      mockUser = { _id: 'cuidador-1', role: 'CUIDADOR_FAMILIAR' };
      mockActivePacienteId = null;

      const { result } = renderHook(() => useActivePatientId());

      expect(result.current.patientId).toBeNull();
      expect(result.current.isCuidador).toBe(true);
      expect(result.current.needsSelection).toBe(true);
    });
  });

  describe('when user is null', () => {
    it('returns null patientId and no cuidador flag', () => {
      mockUser = null;
      mockActivePacienteId = null;

      const { result } = renderHook(() => useActivePatientId());

      expect(result.current.patientId).toBeNull();
      expect(result.current.isCuidador).toBe(false);
      expect(result.current.needsSelection).toBe(false);
    });
  });
});
