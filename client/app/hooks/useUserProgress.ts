import { useCallback, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchJournalStats } from '../store/slices/journalSlice';

export interface UserProgress {
  anxietyLevel: number;
  anxietyManagedRatio: number;
  hasData: boolean;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useUserProgress(): UserProgress {
  const dispatch = useAppDispatch();
  const { progress, isStatsLoading, error } = useAppSelector(
    (state) => state.journal,
  );

  const refresh = useCallback(() => {
    dispatch(fetchJournalStats());
  }, [dispatch]);

  return useMemo(() => {
    const anxiety = progress?.anxietyLevel ?? 0;
    const hasRealData = progress !== null;

    return {
      anxietyLevel: anxiety,
      anxietyManagedRatio: Math.max(0, Math.min(1 - anxiety, 1)),
      hasData: hasRealData,
      isLoading: isStatsLoading,
      error,
      refresh,
    };
  }, [progress, isStatsLoading, error, refresh]);
}
