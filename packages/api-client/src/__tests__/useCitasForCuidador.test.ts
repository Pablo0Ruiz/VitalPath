import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useCitasForCuidador } from '../hooks/useCitas';
import * as appointmentActions from '../actions/appointment.actions';
import type { CitaPopulated } from '@repo/types';

vi.mock('../actions/appointment.actions', () => ({
  getCitasForCuidador: vi.fn(),
  getCitas: vi.fn(),
  postCita: vi.fn(),
  patchCita: vi.fn(),
  deleteCita: vi.fn(),
  getCitasAdministrator: vi.fn(),
  patchCitaEstadoWorker: vi.fn(),
  getCitasMedico: vi.fn(),
  postScheduleForPatient: vi.fn(),
  patchCitaByWorker: vi.fn(),
  deleteCitaByWorker: vi.fn(),
}));

const mockGetCitasForCuidador = vi.mocked(
  appointmentActions.getCitasForCuidador,
);

const MOCK_CITAS: CitaPopulated[] = [
  {
    _id: 'cita-1',
    fecha: '2026-06-01',
    hora: '10:00',
    estado: 'PENDIENTE',
    paciente_ID: 'p1',
    medico_ID: 'med-1',
    centro_ID: 'centro-1',
  } as unknown as CitaPopulated,
];

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useCitasForCuidador', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('when pacienteId is null', () => {
    it('should not call getCitasForCuidador', () => {
      renderHook(() => useCitasForCuidador(null), {
        wrapper: createWrapper(),
      });
      expect(mockGetCitasForCuidador).not.toHaveBeenCalled();
    });

    it('should have fetchStatus "idle" (query is disabled)', async () => {
      const { result } = renderHook(() => useCitasForCuidador(null), {
        wrapper: createWrapper(),
      });
      // When enabled: false, fetchStatus is 'idle'
      expect(result.current.fetchStatus).toBe('idle');
    });
  });

  describe('when pacienteId is an empty string', () => {
    it('should not call getCitasForCuidador', () => {
      renderHook(() => useCitasForCuidador(''), {
        wrapper: createWrapper(),
      });
      expect(mockGetCitasForCuidador).not.toHaveBeenCalled();
    });
  });

  describe('when pacienteId has a value', () => {
    it('should call getCitasForCuidador with the pacienteId', async () => {
      mockGetCitasForCuidador.mockResolvedValueOnce(MOCK_CITAS);

      const { result } = renderHook(() => useCitasForCuidador('p1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockGetCitasForCuidador).toHaveBeenCalledWith('p1');
    });

    it('should return the data from getCitasForCuidador on success', async () => {
      mockGetCitasForCuidador.mockResolvedValueOnce(MOCK_CITAS);

      const { result } = renderHook(() => useCitasForCuidador('p1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(MOCK_CITAS);
    });

    it('should be in loading state initially when pacienteId is provided', () => {
      mockGetCitasForCuidador.mockResolvedValueOnce(MOCK_CITAS);

      const { result } = renderHook(() => useCitasForCuidador('p1'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should call getCitasForCuidador again when pacienteId changes', async () => {
      mockGetCitasForCuidador.mockResolvedValue(MOCK_CITAS);

      let pacienteId = 'p1';
      const { result, rerender } = renderHook(
        () => useCitasForCuidador(pacienteId),
        {
          wrapper: createWrapper(),
        },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockGetCitasForCuidador).toHaveBeenCalledWith('p1');

      pacienteId = 'p2';
      rerender();

      await waitFor(() =>
        expect(mockGetCitasForCuidador).toHaveBeenCalledWith('p2'),
      );
    });
  });
});
