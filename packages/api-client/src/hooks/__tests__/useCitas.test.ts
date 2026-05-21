import { describe, it, expect, vi, beforeEach } from 'vitest';
import { appointmentKeys } from '../../queryKeys';

// Mock @tanstack/react-query so we can capture the queryKey passed to useQuery
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn((opts: { queryKey: unknown[] }) => ({
    data: undefined,
    isLoading: false,
    _queryKey: opts.queryKey,
  })),
  useMutation: vi.fn(() => ({ mutate: vi.fn() })),
  useQueryClient: vi.fn(() => ({ invalidateQueries: vi.fn() })),
}));

// Mock all action functions
vi.mock('../actions/appointment.actions', () => ({
  getCitas: vi.fn(),
  postCita: vi.fn(),
  patchCita: vi.fn(),
  deleteCita: vi.fn(),
  getCitasAdministrator: vi.fn(),
  getCitasMedico: vi.fn(),
  patchCitaEstadoWorker: vi.fn(),
  postScheduleForPatient: vi.fn(),
  patchCitaByWorker: vi.fn(),
  deleteCitaByWorker: vi.fn(),
  getCitasForCuidador: vi.fn(),
}));

import { useQuery } from '@tanstack/react-query';
import type { Mock } from 'vitest';
import { useCitasMedico, useCitasAdministrator } from '../useCitas';

describe('useCitasMedico', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useQuery as Mock).mockImplementation((opts: { queryKey: unknown[] }) => ({
      data: undefined,
      isLoading: false,
      _queryKey: opts.queryKey,
    }));
  });

  it('uses appointmentKeys.list("medico") as query key', () => {
    useCitasMedico();
    const callArgs = (useQuery as Mock).mock.calls[0][0];
    expect(callArgs.queryKey).toEqual(appointmentKeys.list('medico'));
  });

  it('does NOT use appointmentKeys.list("all") as query key', () => {
    useCitasMedico();
    const callArgs = (useQuery as Mock).mock.calls[0][0];
    expect(callArgs.queryKey).not.toEqual(appointmentKeys.list('all'));
  });

  it('medico key and administrator key are deeply different', () => {
    useCitasMedico();
    useCitasAdministrator();
    const medicoKey = (useQuery as Mock).mock.calls[0][0].queryKey;
    const adminKey = (useQuery as Mock).mock.calls[1][0].queryKey;
    expect(medicoKey).not.toEqual(adminKey);
  });
});

describe('useCitasAdministrator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useQuery as Mock).mockImplementation((opts: { queryKey: unknown[] }) => ({
      data: undefined,
      isLoading: false,
      _queryKey: opts.queryKey,
    }));
  });

  it('still uses appointmentKeys.list("all") as query key', () => {
    useCitasAdministrator();
    const callArgs = (useQuery as Mock).mock.calls[0][0];
    expect(callArgs.queryKey).toEqual(appointmentKeys.list('all'));
  });
});
