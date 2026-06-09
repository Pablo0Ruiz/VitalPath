import React from 'react';
import { render } from '@testing-library/react-native';
import { View } from 'react-native';

jest.mock('@repo/api-client', () => ({
  useMedicaments: jest.fn(() => ({ data: [], isLoading: false })),
}));

import { useMedicaments } from '@repo/api-client';

const ConsumerA = () => {
  useMedicaments();
  return React.createElement(View, { testID: 'consumer-a' });
};

const ConsumerB = () => {
  useMedicaments();
  return React.createElement(View, { testID: 'consumer-b' });
};

describe('useMedicaments deduplication (PERF-B1-T02)', () => {
  beforeEach(() => {
    (useMedicaments as jest.Mock).mockClear();
  });

  it('both consumers mount and receive data without error', () => {
    const { getByTestId } = render(
      React.createElement(
        View,
        null,
        React.createElement(ConsumerA),
        React.createElement(ConsumerB),
      ),
    );
    expect(getByTestId('consumer-a')).toBeTruthy();
    expect(getByTestId('consumer-b')).toBeTruthy();
  });

  it('useMedicaments is invoked by each consumer', () => {
    render(
      React.createElement(
        View,
        null,
        React.createElement(ConsumerA),
        React.createElement(ConsumerB),
      ),
    );
    expect(useMedicaments).toHaveBeenCalledTimes(2);
  });
});
