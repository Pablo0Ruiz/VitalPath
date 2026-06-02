import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { MedicationFormModal } from './MedicationFormModal';

// ── Theme ─────────────────────────────────────────────────────────────────────

jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => ({
    textPrimary: '#111',
    textSecondary: '#666',
    surfaceElevated: '#fff',
    primary500: '#6480f8',
    primary600: '#4f6ef7',
    border: '#E4E7EF',
  }),
}));

// ── Notification helpers ───────────────────────────────────────────────────────

jest.mock('@/src/utils/medicationNotifications', () => ({
  scheduleNotifications: jest.fn().mockResolvedValue([]),
  cancelNotifications: jest.fn().mockResolvedValue(undefined),
}));

// ── TanStack Query hooks ───────────────────────────────────────────────────────

const mockCreateMutateAsync = jest.fn();
const mockUpdateMutateAsync = jest.fn();

const EXISTING_MEDICATION = {
  _id: 'med-1',
  name: 'Paracetamol',
  description: 'Pain relief',
  startTime: '08:00',
  frequencyHours: 8,
  durationDays: 7,
  notificationIds: [],
};

jest.mock('@repo/api-client', () => ({
  useCreateMedication: () => ({ mutateAsync: mockCreateMutateAsync }),
  useUpdateMedication: () => ({ mutateAsync: mockUpdateMutateAsync }),
  useMedicament: (_id: string, enabled: boolean) => ({
    data: enabled ? EXISTING_MEDICATION : undefined,
  }),
}));

// ─── Suite ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockCreateMutateAsync.mockResolvedValue({
    _id: 'new-med',
    name: 'Ibuprofeno',
    frequencyHours: 8,
  });
  mockUpdateMutateAsync.mockResolvedValue(EXISTING_MEDICATION);
});

const sharedProps = { visible: true, onClose: jest.fn() };

describe('MedicationFormModal — create mode', () => {
  it('renders the create mode title', () => {
    const { getByText } = render(
      <MedicationFormModal {...sharedProps} mode="create" />,
    );
    expect(getByText('Datos del medicamento')).toBeTruthy();
  });

  it('shows the Save and Close buttons', () => {
    const { getByText } = render(
      <MedicationFormModal {...sharedProps} mode="create" />,
    );
    expect(getByText('Guardar')).toBeTruthy();
    expect(getByText('Cerrar')).toBeTruthy();
  });

  it('does NOT call createMutation when name field is empty', async () => {
    const { getByText } = render(
      <MedicationFormModal {...sharedProps} mode="create" />,
    );

    await act(async () => {
      fireEvent.press(getByText('Guardar'));
    });

    expect(mockCreateMutateAsync).not.toHaveBeenCalled();
  });
});

describe('MedicationFormModal — edit mode', () => {
  it('renders the edit mode title', () => {
    const { getByText } = render(
      <MedicationFormModal {...sharedProps} mode="edit" medicationId="med-1" />,
    );
    expect(getByText('Editar medicamento')).toBeTruthy();
  });

  it('prefills the name field with existing medication data', async () => {
    const { getByDisplayValue } = render(
      <MedicationFormModal {...sharedProps} mode="edit" medicationId="med-1" />,
    );

    await waitFor(() => {
      expect(getByDisplayValue('Paracetamol')).toBeTruthy();
    });
  });

  it('calls updateMutation on submit in edit mode', async () => {
    const { getByText } = render(
      <MedicationFormModal {...sharedProps} mode="edit" medicationId="med-1" />,
    );

    await waitFor(() => expect(getByText('Editar medicamento')).toBeTruthy());

    await act(async () => {
      fireEvent.press(getByText('Guardar'));
    });

    await waitFor(() => {
      expect(mockUpdateMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'med-1' }),
      );
    });
  });
});

describe('MedicationFormModal — close button', () => {
  it('calls onClose when the Cerrar button is pressed', () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <MedicationFormModal mode="create" visible={true} onClose={onClose} />,
    );

    fireEvent.press(getByText('Cerrar'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
