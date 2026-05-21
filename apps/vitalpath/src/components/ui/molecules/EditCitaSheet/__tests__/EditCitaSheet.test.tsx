import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { EditCitaSheet } from '../EditCitaSheet';

// --- Mocks ---

const mockMutateAsync = jest.fn();
jest.mock('@repo/api-client', () => ({
  useUpdateCita: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => ({
    background: '#fff',
    surfaceElevated: '#fff',
    textPrimary: '#000',
    textSecondary: '#666',
    primary600: '#2563eb',
    neutral100: '#f4f4f5',
    neutral200: '#e5e7eb',
    neutral400: '#9ca3af',
    neutral600: '#4b5563',
    border: '#e5e7eb',
    error: '#ef4444',
    errorLight: '#fee2e2',
    minTouchTarget: 44,
  }),
}));

// parseLocalDateTime is the real implementation — no mock so guards work correctly
jest.mock('@/src/utils/date', () => ({
  ...jest.requireActual('@/src/utils/date'),
}));

// --- Helpers ---

/** Returns a fecha/hora pair that is 2 days in the future */
function futureDateTime(): { fecha: string; hora: string } {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  const fecha = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return { fecha, hora: '10:00' };
}

/** Returns a fecha/hora pair that is 2 days in the past */
function pastDateTime(): { fecha: string; hora: string } {
  const d = new Date();
  d.setDate(d.getDate() - 2);
  const fecha = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return { fecha, hora: '10:00' };
}

/** Returns today's date key */
function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Returns a time string that is 2 hours in the past (same-day guard) */
function pastTimeToday(): string {
  const d = new Date();
  d.setHours(d.getHours() - 2);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// --- Tests ---

describe('EditCitaSheet', () => {
  const defaultProps = {
    isOpen: true,
    citaId: 'cita-123',
    prefillFecha: futureDateTime().fecha,
    prefillHora: futureDateTime().hora,
    onClose: jest.fn(),
    onSuccess: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with prefilled fecha and hora', () => {
    const { fecha, hora } = futureDateTime();
    const { getByDisplayValue } = render(
      <EditCitaSheet
        {...defaultProps}
        prefillFecha={fecha}
        prefillHora={hora}
      />,
    );
    expect(getByDisplayValue(fecha)).toBeTruthy();
    expect(getByDisplayValue(hora)).toBeTruthy();
  });

  it('blocks submission and shows error when fecha+hora is in the past', async () => {
    const { fecha, hora } = pastDateTime();
    const { getByTestId, getByText } = render(
      <EditCitaSheet
        {...defaultProps}
        prefillFecha={fecha}
        prefillHora={hora}
      />,
    );
    fireEvent.press(getByTestId('edit-cita-submit'));
    await waitFor(() => {
      expect(
        getByText(/fecha.*pasada|past.*date|date.*past|pasado/i),
      ).toBeTruthy();
    });
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('blocks submission and shows error when fecha is today and hora is in the past', async () => {
    const fecha = todayKey();
    const hora = pastTimeToday();
    const { getByTestId, queryByTestId } = render(
      <EditCitaSheet
        {...defaultProps}
        prefillFecha={fecha}
        prefillHora={hora}
      />,
    );
    fireEvent.press(getByTestId('edit-cita-submit'));
    await waitFor(() => {
      expect(queryByTestId('edit-cita-error')).toBeTruthy();
    });
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('allows submission when datetime is in the future', async () => {
    const { fecha, hora } = futureDateTime();
    mockMutateAsync.mockResolvedValue({});
    const { getByTestId } = render(
      <EditCitaSheet
        {...defaultProps}
        prefillFecha={fecha}
        prefillHora={hora}
      />,
    );
    fireEvent.press(getByTestId('edit-cita-submit'));
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledTimes(1);
    });
  });

  it('calls useUpdateCita with correct payload on valid submit', async () => {
    const { fecha, hora } = futureDateTime();
    mockMutateAsync.mockResolvedValue({});
    const { getByTestId } = render(
      <EditCitaSheet
        {...defaultProps}
        citaId="cita-abc"
        prefillFecha={fecha}
        prefillHora={hora}
      />,
    );
    fireEvent.press(getByTestId('edit-cita-submit'));
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        id: 'cita-abc',
        payload: { fecha, hora },
      });
    });
  });

  it('shows error message when fecha is in the past', async () => {
    const { fecha, hora } = pastDateTime();
    const { getByTestId, queryByTestId } = render(
      <EditCitaSheet
        {...defaultProps}
        prefillFecha={fecha}
        prefillHora={hora}
      />,
    );
    fireEvent.press(getByTestId('edit-cita-submit'));
    await waitFor(() => {
      expect(queryByTestId('edit-cita-error')).toBeTruthy();
    });
  });

  it('calls onSuccess and onClose after successful submission', async () => {
    const { fecha, hora } = futureDateTime();
    mockMutateAsync.mockResolvedValue({});
    const onClose = jest.fn();
    const onSuccess = jest.fn();
    const { getByTestId } = render(
      <EditCitaSheet
        {...defaultProps}
        prefillFecha={fecha}
        prefillHora={hora}
        onClose={onClose}
        onSuccess={onSuccess}
      />,
    );
    fireEvent.press(getByTestId('edit-cita-submit'));
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
