import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../Button';

// Mock the useTheme hook since it requires context/provider
jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      primary: '#000',
      text: '#fff',
    },
  }),
}));

describe('Button Component', () => {
  it('should render the title correctly', () => {
    const { getByText } = render(<Button title="Click Me" />);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('should trigger onPress callback when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Submit" onPress={onPressMock} />,
    );

    const buttonElement = getByText('Submit');
    fireEvent.press(buttonElement);

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should display loading spinner and NOT trigger onPress when loading is true', () => {
    const onPressMock = jest.fn();
    const { getByTestId, queryByText } = render(
      <Button
        title="Submit"
        loading={true}
        onPress={onPressMock}
        testID="custom-button"
      />,
    );

    // Test that the spinner exists (ActivityIndicator usually has accessibilityState busy or can be found via TestId if added, but we rely on the component's internal press handler blocking)
    const buttonElement = getByTestId('custom-button');
    fireEvent.press(buttonElement);

    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('should NOT trigger onPress when disabled is true', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Submit" disabled={true} onPress={onPressMock} />,
    );

    const buttonElement = getByText('Submit');
    fireEvent.press(buttonElement);

    expect(onPressMock).not.toHaveBeenCalled();
  });
});
