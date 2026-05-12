import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenWrapper, Card, LoadingState, ErrorState } from '../components/ui';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import AnxietyChart from '../components/AnxietyChart';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchJournalStats } from '../store/slices/journalSlice';
import { useTranslation } from '../i18n';
import { useAnxietyTrend } from '../hooks/useAnxietyTrend';
import { useUserProgress } from '../hooks/useUserProgress';

export default function DashboardScreen() {
  const dispatch = useAppDispatch();
  const { stats, isStatsLoading, error } = useAppSelector((state) => state.journal);
  const { t } = useTranslation();
  const trend = useAnxietyTrend(30);
  const progress = useUserProgress();

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchJournalStats());
      trend.refresh();
    }, [dispatch, trend.refresh]),
  );

  const trendStat = useMemo(() => {
    if (!trend.summary) return { label: '--', icon: 'analytics-outline' as const };
    const dir = trend.summary.trendDirection;
    const pct = trend.summary.trendPercent;
    if (dir === 'improving') return { label: `↓${pct}%`, icon: 'trending-down-outline' as const };
    if (dir === 'increasing') return { label: `↑${pct}%`, icon: 'trending-up-outline' as const };
    return { label: `→${pct}%`, icon: 'analytics-outline' as const };
  }, [trend.summary]);

  if (isStatsLoading && !stats) {
    return <LoadingState message={t('dashboard.loadingDashboard')} />;
  }

  if (error && !stats) {
    return <ErrorState message={error} onRetry={() => dispatch(fetchJournalStats())} />;
  }

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.title}>{t('dashboard.title')}</Text>
        <Text style={styles.subtitle}>{t('dashboard.subtitle')}</Text>
      </View>

      <View style={styles.statsRow}>
        <StatCard
          icon="flame-outline"
          label={t('dashboard.streak')}
          value={stats?.weeklyStreak || '0'}
          color={Number(stats?.weeklyStreak) > 3 ? colors.category.success : colors.category.general}
        />
        <View style={{ width: spacing.md }} />
        <StatCard
          icon={trendStat.icon}
          label={t('dashboard.anxietyTrend')}
          value={trendStat.label}
          color={ 
            trend.summary?.trendDirection === 'improving'
              ? '#43E97B'
              : trend.summary?.trendDirection === 'increasing'
                ? '#FD746C'
                : colors.secondary
          }
        />
        <View style={{ width: spacing.md }} />
        <StatCard
          icon="book-outline"
          label={t('dashboard.entries')}
          value={stats?.totalEntries || 0}
          color={colors.category.general}
        />
      </View>

      <AnxietyChart
        points={trend.points}
        summary={trend.summary}
        range={trend.range}
        onRangeChange={trend.setRange}
      />

      {progress.hasData && (
        <Card style={styles.progressCard}>
          <Text style={styles.cardTitle}>{t('dashboard.yourProgress')}</Text>
          <ProgressBar
            value={progress.anxietyManagedRatio}
            label={t('dashboard.anxietyLevel')}
            valueLabel={t('dashboard.managed', {
              percent: (progress.anxietyManagedRatio * 100).toFixed(0),
            })}
            color={colors.primary}
          />
        </Card>
      )}

      {progress.hasData && (
        <Card style={styles.insightCard}>
          <Text style={styles.cardTitle}>{t('dashboard.insights')}</Text>
          {stats?.anxietyReduction !== '0%' && (
            <View style={styles.insightRow}>
              <View style={[styles.insightDot, { backgroundColor: colors.primary }]} />
              <Text style={styles.insightText}>
                {t('dashboard.anxietyReductionInsight', { value: stats?.anxietyReduction ?? '0%' })}
              </Text>
            </View>
          )}
          {trend.summary?.trendDirection && (
            <View style={styles.insightRow}>
              <View
                style={[
                  styles.insightDot,
                  {
                    backgroundColor:
                      trend.summary.trendDirection === 'improving'
                        ? '#43E97B'
                        : trend.summary.trendDirection === 'increasing'
                          ? '#FD746C'
                          : colors.text.tertiary,
                  },
                ]}
              />
              <Text style={styles.insightText}>
                {t(`dashboard.chart.${trend.summary.trendDirection}`, {
                  percent: trend.summary.trendPercent,
                })}
              </Text>
            </View>
          )}
          <View style={styles.insightRow}>
            <View style={[styles.insightDot, { backgroundColor: colors.accent }]} />
            <Text style={styles.insightText}>
              {t('dashboard.keepJournaling')}
            </Text>
          </View>
        </Card>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing.md,
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },
  progressCard: {
    marginBottom: spacing.base,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.base,
  },
  insightCard: {
    marginBottom: spacing.base,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  insightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginEnd: spacing.md,
  },
  insightText: {
    ...typography.body,
    color: colors.text.secondary,
    flex: 1,
  },
});
