import { useCallback, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchJournalStats } from '../store/slices/journalSlice';

export interface UserProgress {
  /** Mood average on 0-1 scale (mapped from 1-5). */
  moodRatio: number;
  /** Raw mood average (1-5 scale). */
  moodAvg: number;
  /** Raw anxiety level (0-1 scale). 0 = no anxiety. */
  anxietyLevel: number;
  /** Anxiety "managed" ratio (1 - anxietyLevel), on 0-1 scale. */
  anxietyManagedRatio: number;
  /** Whether stats have been loaded at least once. */
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
    const rawMood = progress?.avgMood ?? 0;
    const anxiety = progress?.anxietyLevel ?? 0;

    // avgMood = 0 means no entries (mood scale is 1-5, 0 is impossible)
    const hasRealData = progress !== null && rawMood > 0;
    // Normalize 1-5 → 0-1 so mood 1 = 0% and mood 5 = 100%
    const moodNormalized = hasRealData ? (rawMood - 1) / 4 : 0;

    return {
      moodRatio: Math.max(0, Math.min(moodNormalized, 1)),
      moodAvg: rawMood,
      anxietyLevel: anxiety,
      anxietyManagedRatio: Math.max(0, Math.min(1 - anxiety, 1)),
      hasData: hasRealData,
      isLoading: isStatsLoading,
      error,
      refresh,
    };
  }, [progress, isStatsLoading, error, refresh]);
}
