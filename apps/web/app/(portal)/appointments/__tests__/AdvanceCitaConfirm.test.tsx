import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { type Mock } from 'vitest';
import { CitaEstadoEnum, type CitaPopulated } from '@repo/types';

vi.mock('@repo/api-client', () => ({
  useAvanzarCitaEstado: vi.fn(),
}));

import { useAvanzarCitaEstado } from '@repo/api-client';
import AdvanceCitaConfirm from '../AdvanceCitaConfirm';

const mockCita: CitaPopulated = {
  _id: 'cita-1',
  estado: CitaEstadoEnum.AGENDADA,
  fecha: '2026-01-01',
  hora: '10:00',
  createdAt: '',
  updatedAt: '',
  paciente_ID: { _id: 'p1', name: 'Juan', lastName: 'Pérez' },
  medico_ID: {
    _id: 'm1',
    name: 'Dr',
    lastName: 'Smith',
    especialidad: 'General',
  },
  centroSalud_ID: { _id: 'c1', nombre: 'Centro', direccion: 'Calle 1' },
};

const nextEstado = CitaEstadoEnum.ASISTIDA;

describe('AdvanceCitaConfirm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders patient name, current state label, and next state label', () => {
    (useAvanzarCitaEstado as unknown as Mock).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });

    render(
      <AdvanceCitaConfirm
        cita={mockCita}
        nextEstado={nextEstado}
        onConfirmed={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText(/Juan/)).toBeInTheDocument();
    expect(screen.getByText(/Agendada/)).toBeInTheDocument();
    expect(screen.getByText(/Asistida/)).toBeInTheDocument();
  });

  it('calls mutate with { id, estado } when "Confirmar" is clicked', async () => {
    const mutate = vi.fn();
    (useAvanzarCitaEstado as unknown as Mock).mockReturnValue({
      mutate,
      isPending: false,
    });

    render(
      <AdvanceCitaConfirm
        cita={mockCita}
        nextEstado={nextEstado}
        onConfirmed={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    await userEvent.click(screen.getByText('Confirmar'));
    expect(mutate).toHaveBeenCalledWith(
      { id: mockCita._id, estado: nextEstado },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });

  it('calls onConfirmed when onSuccess callback is invoked', async () => {
    const onConfirmed = vi.fn();
    let capturedOnSuccess: (() => void) | undefined;

    const mutate = vi.fn((_args: unknown, opts: { onSuccess: () => void }) => {
      capturedOnSuccess = opts.onSuccess;
    });

    (useAvanzarCitaEstado as unknown as Mock).mockReturnValue({
      mutate,
      isPending: false,
    });

    render(
      <AdvanceCitaConfirm
        cita={mockCita}
        nextEstado={nextEstado}
        onConfirmed={onConfirmed}
        onCancel={vi.fn()}
      />,
    );

    await userEvent.click(screen.getByText('Confirmar'));
    capturedOnSuccess?.();
    expect(onConfirmed).toHaveBeenCalled();
  });

  it('shows loading state on confirm button when isPending is true', () => {
    (useAvanzarCitaEstado as unknown as Mock).mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
    });

    render(
      <AdvanceCitaConfirm
        cita={mockCita}
        nextEstado={nextEstado}
        onConfirmed={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    const confirmBtn = screen.getByText('Confirmar').closest('button');
    expect(confirmBtn).toBeDisabled();
  });

  it('calls onCancel without calling mutate when "Volver" is clicked', async () => {
    const mutate = vi.fn();
    const onCancel = vi.fn();

    (useAvanzarCitaEstado as unknown as Mock).mockReturnValue({
      mutate,
      isPending: false,
    });

    render(
      <AdvanceCitaConfirm
        cita={mockCita}
        nextEstado={nextEstado}
        onConfirmed={vi.fn()}
        onCancel={onCancel}
      />,
    );

    await userEvent.click(screen.getByText('Volver'));
    expect(onCancel).toHaveBeenCalled();
    expect(mutate).not.toHaveBeenCalled();
  });
});
