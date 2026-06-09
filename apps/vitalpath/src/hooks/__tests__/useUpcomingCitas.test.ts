const mockQueryFn = jest.fn().mockResolvedValue([]);

jest.mock('@repo/api-client', () => ({
  useCitas: (userId: string) => ({
    data: userId ? [] : undefined,
    isLoading: !userId,
    _enabled: !!userId,
  }),
}));

let capturedUserId: string | undefined;

jest.mock('@repo/api-client', () => ({
  useCitas: (userId: string) => {
    capturedUserId = userId;
    if (!userId) {
      return { data: [], isLoading: false };
    }
    mockQueryFn();
    return { data: [], isLoading: false };
  },
}));

jest.mock('@/src/utils/date', () => ({
  parseLocalDateTime: jest.fn(() => new Date()),
  formatDateHuman: jest.fn((d: string) => d),
}));

import { useUpcomingCitas } from '../useUpcomingCitas';
import { renderHook } from '@testing-library/react-native';

describe('useUpcomingCitas — PERF-B1-T01', () => {
  beforeEach(() => {
    mockQueryFn.mockClear();
    capturedUserId = undefined;
  });

  it('does NOT invoke the query function when patientId is empty string', () => {
    renderHook(() => useUpcomingCitas(''));
    expect(mockQueryFn).not.toHaveBeenCalled();
  });

  it('returns isLoading=false and empty upcomingCitas when patientId is empty', () => {
    const { result } = renderHook(() => useUpcomingCitas(''));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.upcomingCitas).toEqual([]);
  });

  it('passes patientId through to useCitas when provided', () => {
    renderHook(() => useUpcomingCitas('patient-abc'));
    expect(capturedUserId).toBe('patient-abc');
  });
});
