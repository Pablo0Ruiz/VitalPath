import React from 'react';
import { Text } from 'react-native';
import { render, act } from '@testing-library/react-native';

// ── Mock useVersionCheck ───────────────────────────────────────────────────────
let mockIsLoading = true;
let mockIsBlocked = false;

jest.mock('@/src/hooks/useVersionCheck', () => ({
  useVersionCheck: () => ({
    isLoading: mockIsLoading,
    isBlocked: mockIsBlocked,
  }),
}));

// ── Import AFTER mock is registered ───────────────────────────────────────────
import { VersionGate } from '../index';

describe('VersionGate', () => {
  beforeEach(() => {
    mockIsLoading = true;
    mockIsBlocked = false;
  });

  describe('loading state', () => {
    it('renders a loading indicator when version check is in-flight', () => {
      mockIsLoading = true;
      const { getByTestId } = render(
        <VersionGate>
          <Text>children</Text>
        </VersionGate>,
      );
      expect(getByTestId('version-gate-loading')).toBeTruthy();
    });

    it('does NOT render children while loading', () => {
      mockIsLoading = true;
      const { queryByText } = render(
        <VersionGate>
          <Text>children</Text>
        </VersionGate>,
      );
      expect(queryByText('children')).toBeNull();
    });
  });

  describe('resolved state', () => {
    it('renders children when version check completes and not blocked', () => {
      mockIsLoading = false;
      mockIsBlocked = false;
      const { getByText } = render(
        <VersionGate>
          <Text>children</Text>
        </VersionGate>,
      );
      expect(getByText('children')).toBeTruthy();
    });

    it('does NOT render loading indicator when resolved', () => {
      mockIsLoading = false;
      const { queryByTestId } = render(
        <VersionGate>
          <Text>children</Text>
        </VersionGate>,
      );
      expect(queryByTestId('version-gate-loading')).toBeNull();
    });
  });

  describe('onResolved callback', () => {
    it('calls onResolved when isLoading transitions from true to false', () => {
      const onResolved = jest.fn();
      mockIsLoading = false;

      render(
        <VersionGate onResolved={onResolved}>
          <Text>children</Text>
        </VersionGate>,
      );

      expect(onResolved).toHaveBeenCalledTimes(1);
    });

    it('does NOT call onResolved while still loading', () => {
      const onResolved = jest.fn();
      mockIsLoading = true;

      render(
        <VersionGate onResolved={onResolved}>
          <Text>children</Text>
        </VersionGate>,
      );

      expect(onResolved).not.toHaveBeenCalled();
    });

    it('works correctly without onResolved prop (optional)', () => {
      mockIsLoading = false;
      expect(() =>
        render(
          <VersionGate>
            <Text>children</Text>
          </VersionGate>,
        ),
      ).not.toThrow();
    });
  });

  describe('blocked state', () => {
    it('calls onResolved even when version check is blocked', () => {
      const onResolved = jest.fn();
      mockIsLoading = false;
      mockIsBlocked = true;

      render(
        <VersionGate onResolved={onResolved}>
          <Text>children</Text>
        </VersionGate>,
      );

      expect(onResolved).toHaveBeenCalledTimes(1);
    });
  });
});
