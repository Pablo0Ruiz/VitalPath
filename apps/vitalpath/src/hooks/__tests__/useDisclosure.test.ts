import { renderHook, act } from '@testing-library/react-native';
import { useDisclosure } from '../useDisclosure';

describe('useDisclosure Hook', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useDisclosure());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.data).toBeNull();
  });

  it('should initialize with true if initial state is true', () => {
    const { result } = renderHook(() => useDisclosure(true));

    expect(result.current.isOpen).toBe(true);
  });

  it('should open and set data correctly', () => {
    const { result } = renderHook(() => useDisclosure<{ id: number }>());

    act(() => {
      result.current.open({ id: 123 });
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.data).toEqual({ id: 123 });
  });

  it('should close and clear data correctly', () => {
    const { result } = renderHook(() => useDisclosure<{ id: number }>());

    act(() => {
      result.current.open({ id: 123 });
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.close();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.data).toBeNull();
  });

  it('should toggle state correctly', () => {
    const { result } = renderHook(() => useDisclosure());

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isOpen).toBe(false);
  });
});
