import { useCallback, useState } from 'react';

export interface DisclosureState<T = void> {
  isOpen: boolean;
  data: T | null;
  open: (payload?: T) => void;
  close: () => void;
  toggle: () => void;
}

export function useDisclosure<T = void>(initial = false): DisclosureState<T> {
  const [isOpen, setIsOpen] = useState(initial);
  const [data, setData] = useState<T | null>(null);

  const open = useCallback((payload?: T) => {
    setIsOpen(true);
    if (payload !== undefined) setData(payload as T);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return { isOpen, data, open, close, toggle };
}
