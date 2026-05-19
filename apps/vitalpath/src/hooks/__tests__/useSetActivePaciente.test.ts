import { renderHook, act } from '@testing-library/react-native';

// Mutable state — prefixed with `mock` so jest hoisting allows it
const mockSetActivePaciente = jest.fn();
const mockRemoveQueries = jest.fn();

jest.mock('@/src/stores/activePaciente', () => ({
  useActivePacienteStore: (
    selector: (s: { setActivePaciente: jest.Mock }) => unknown,
  ) => selector({ setActivePaciente: mockSetActivePaciente }),
}));

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ removeQueries: mockRemoveQueries }),
}));

jest.mock('@repo/api-client', () => ({
  appointmentKeys: { all: ['appointments'] },
  resumeKeys: { all: ['resume'] },
}));

import { useSetActivePaciente } from '../useSetActivePaciente';

describe('useSetActivePaciente', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls setActivePaciente from the store with correct payload', () => {
    const { result } = renderHook(() => useSetActivePaciente());

    act(() => {
      result.current({ id: 'p1', nombre: 'Ana García' });
    });

    expect(mockSetActivePaciente).toHaveBeenCalledTimes(1);
    expect(mockSetActivePaciente).toHaveBeenCalledWith({
      id: 'p1',
      nombre: 'Ana García',
    });
  });

  it('calls removeQueries with appointmentKeys.all', () => {
    const { result } = renderHook(() => useSetActivePaciente());

    act(() => {
      result.current({ id: 'p2', nombre: 'Luis Pérez' });
    });

    expect(mockRemoveQueries).toHaveBeenCalledWith({
      queryKey: ['appointments'],
    });
  });

  it('calls removeQueries with resumeKeys.all', () => {
    const { result } = renderHook(() => useSetActivePaciente());

    act(() => {
      result.current({ id: 'p2', nombre: 'Luis Pérez' });
    });

    expect(mockRemoveQueries).toHaveBeenCalledWith({ queryKey: ['resume'] });
  });

  it('calls removeQueries exactly twice (one per key family)', () => {
    const { result } = renderHook(() => useSetActivePaciente());

    act(() => {
      result.current({ id: 'p3', nombre: 'María López' });
    });

    expect(mockRemoveQueries).toHaveBeenCalledTimes(2);
  });

  it('returns a function', () => {
    const { result } = renderHook(() => useSetActivePaciente());
    expect(typeof result.current).toBe('function');
  });
});
