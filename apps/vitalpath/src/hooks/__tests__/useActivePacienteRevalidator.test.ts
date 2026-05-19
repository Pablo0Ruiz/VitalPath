import { renderHook } from '@testing-library/react-native';

// Mutable state — prefixed with `mock` so jest hoisting allows it
const mockClearActivePaciente = jest.fn();
let mockActivePacienteId: string | null = null;
let mockAuthUser: { role: string } | null = null;
let mockMisPacientesData: {
  paciente_id: { _id: string };
  estado_vinculo: string;
}[] = [];
let mockMisPacientesIsSuccess = false;

jest.mock('@/src/stores/activePaciente', () => ({
  useActivePacienteStore: (
    selector: (s: {
      activePacienteId: typeof mockActivePacienteId;
      clearActivePaciente: jest.Mock;
    }) => unknown,
  ) =>
    selector({
      activePacienteId: mockActivePacienteId,
      clearActivePaciente: mockClearActivePaciente,
    }),
}));

jest.mock('@/src/stores/auth', () => ({
  useAuthStore: (selector: (s: { user: typeof mockAuthUser }) => unknown) =>
    selector({ user: mockAuthUser }),
}));

jest.mock('@repo/api-client', () => ({
  useMisPacientes: () => ({
    data: mockMisPacientesData,
    isSuccess: mockMisPacientesIsSuccess,
  }),
}));

import { useActivePacienteRevalidator } from '../useActivePacienteRevalidator';

describe('useActivePacienteRevalidator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockActivePacienteId = null;
    mockMisPacientesData = [];
    mockMisPacientesIsSuccess = false;
    mockAuthUser = null;
  });

  it('does nothing when activePacienteId is null', () => {
    mockAuthUser = { role: 'CUIDADOR_FAMILIAR' };
    mockActivePacienteId = null;
    mockMisPacientesIsSuccess = true;
    mockMisPacientesData = [
      { paciente_id: { _id: 'p1' }, estado_vinculo: 'ACTIVO' },
    ];

    renderHook(() => useActivePacienteRevalidator());

    expect(mockClearActivePaciente).not.toHaveBeenCalled();
  });

  it('does nothing when isSuccess is false (data still loading)', () => {
    mockAuthUser = { role: 'CUIDADOR_FAMILIAR' };
    mockActivePacienteId = 'p1';
    mockMisPacientesIsSuccess = false;
    mockMisPacientesData = [];

    renderHook(() => useActivePacienteRevalidator());

    expect(mockClearActivePaciente).not.toHaveBeenCalled();
  });

  it('does nothing when activePacienteId is in the list with ACTIVO status', () => {
    mockAuthUser = { role: 'CUIDADOR_FAMILIAR' };
    mockActivePacienteId = 'p1';
    mockMisPacientesIsSuccess = true;
    mockMisPacientesData = [
      { paciente_id: { _id: 'p1' }, estado_vinculo: 'ACTIVO' },
    ];

    renderHook(() => useActivePacienteRevalidator());

    expect(mockClearActivePaciente).not.toHaveBeenCalled();
  });

  it('calls clearActivePaciente when activePacienteId is NOT in the list (link revoked)', () => {
    mockAuthUser = { role: 'CUIDADOR_FAMILIAR' };
    mockActivePacienteId = 'p-revoked';
    mockMisPacientesIsSuccess = true;
    mockMisPacientesData = [
      { paciente_id: { _id: 'p1' }, estado_vinculo: 'ACTIVO' },
    ];

    renderHook(() => useActivePacienteRevalidator());

    expect(mockClearActivePaciente).toHaveBeenCalledTimes(1);
  });

  it('does nothing when user is not CUIDADOR_FAMILIAR', () => {
    mockAuthUser = { role: 'PACIENTE' };
    mockActivePacienteId = 'p1';
    mockMisPacientesIsSuccess = true;
    mockMisPacientesData = [];

    renderHook(() => useActivePacienteRevalidator());

    expect(mockClearActivePaciente).not.toHaveBeenCalled();
  });

  it('calls clearActivePaciente when entry exists but has REVOCADO status', () => {
    mockAuthUser = { role: 'CUIDADOR_FAMILIAR' };
    mockActivePacienteId = 'p-revoked';
    mockMisPacientesIsSuccess = true;
    mockMisPacientesData = [
      { paciente_id: { _id: 'p-revoked' }, estado_vinculo: 'REVOCADO' },
    ];

    renderHook(() => useActivePacienteRevalidator());

    expect(mockClearActivePaciente).toHaveBeenCalledTimes(1);
  });
});
