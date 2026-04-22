import { useCallback, useRef } from 'react';
import { useFocusEffect } from 'expo-router';
import type { QueryObserverResult } from '@tanstack/react-query';

export function useRefetchOnFocus<T>(
  refetch: () => Promise<QueryObserverResult<T>>,
) {
  const firstTimeRef = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }
      refetch();
    }, [refetch]),
  );
}
