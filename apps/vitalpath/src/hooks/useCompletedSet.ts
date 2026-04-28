import { useCallback, useState } from 'react';

export interface CompletedSetState {
  completedIds: string[];
  markCompleted: (id: string) => void;
  isCompleted: (id: string) => boolean;
  reset: () => void;
}

export function useCompletedSet(): CompletedSetState {
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const markCompleted = useCallback((id: string) => {
    setCompletedIds(prev => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const isCompleted = useCallback(
    (id: string) => completedIds.includes(id),
    [completedIds],
  );

  const reset = useCallback(() => {
    setCompletedIds([]);
  }, []);

  return { completedIds, markCompleted, isCompleted, reset };
}
