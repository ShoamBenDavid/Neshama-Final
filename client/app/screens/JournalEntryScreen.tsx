import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper, Header, LoadingState, ErrorState, Card, Button } from '../components/ui';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { useAppDispatch } from '../store/hooks';
import { deleteJournalEntry } from '../store/slices/journalSlice';
import { journalAPI, JournalEntry } from '../services/api';
import { useTranslation } from '../i18n';
import type { RootStackParamList } from '../navigation/StackNavigator';

const MOOD_EMOJIS: Record<number, string> = {
  1: '😔', 2: '😕', 3: '😐', 4: '🙂', 5: '😊',
};

type RouteParams = RouteProp<RootStackParamList, 'JournalEntry'>;

export default function JournalEntryScreen() {
  const route = useRoute<RouteParams>();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { entryId } = route.params;
  const { t } = useTranslation();

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAnxietyLabel = (label: string) => {
    const normalizedLabel = label.trim().toLowerCase();
    if (normalizedLabel === 'high') return t('journal.anxietyLevelHigh');
    if (normalizedLabel === 'moderate') return t('journal.anxietyLevelModerate');
    if (normalizedLabel === 'low') return t('journal.anxietyLevelLow');
    return label;
  };

  useEffect(() => {
    loadEntry();
  }, [entryId]);

  const loadEntry = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await journalAPI.getEntry(entryId);
      if (response.success) {
        setEntry(response.data.entry);
      }
    } catch (err: any) {
      setError(err.message || t('journal.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      t('journal.deleteEntry'),
      t('journal.deleteConfirmation'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            await dispatch(deleteJournalEntry(entryId));
            navigation.goBack();
          },
        },
      ],
    );
  };

  if (loading) return <LoadingState message={t('journal.loadingEntry')} />;
  if (error) return <ErrorState message={error} onRetry={loadEntry} />;
  if (!entry) return <ErrorState message={t('journal.entryNotFound')} />;

  return (
    <ScreenWrapper>
      <Header
        title={t('journal.journalEntry')}
        showBack
        rightAction={
          <Ionicons
            name="trash-outline"
            size={22}
            color={colors.status.error}
            onPress={handleDelete}
          />
        }
      />

      <Card style={styles.moodCard}>
        <View style={styles.moodRow}>
          <Text style={styles.moodEmoji}>{MOOD_EMOJIS[entry.mood] || '😐'}</Text>
          <View>
            <Text style={[styles.moodLabel, { color: colors.mood[entry.mood] }]}>
              {colors.moodLabel[entry.mood] || t('common.unknown')}
            </Text>
            <Text style={styles.moodDate}>{entry.date} · {entry.time}</Text>
          </View>
        </View>
        {entry.anxietyLabel && (
          <View style={styles.anxietyBadge}>
            <Ionicons name="pulse-outline" size={14} color={colors.text.tertiary} />
            <Text style={styles.anxietyText}>
              {t('journal.anxietyLabel', { label: getAnxietyLabel(entry.anxietyLabel) })}
            </Text>
          </View>
        )}
      </Card>

      {entry.title && <Text style={styles.title}>{entry.title}</Text>}

      <Text style={styles.content}>{entry.content}</Text>

      {entry.tags.length > 0 && (
        <View style={styles.tagsSection}>
          <Text style={styles.tagsLabel}>{t('journal.tags')}</Text>
          <View style={styles.tagsRow}>
            {entry.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.deleteSection}>
        <Button
          title={t('journal.deleteEntry')}
          variant="danger"
          size="md"
          onPress={handleDelete}
          icon={<Ionicons name="trash-outline" size={18} color={colors.text.inverse} />}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  moodCard: {
    marginBottom: spacing.xl,
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  moodEmoji: {
    fontSize: 40,
  },
  moodLabel: {
    ...typography.h4,
  },
  moodDate: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  anxietyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  anxietyText: {
    ...typography.caption,
    color: colors.text.secondary,
    textTransform: 'capitalize',
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  content: {
    ...typography.body,
    color: colors.text.primary,
    lineHeight: 26,
    marginBottom: spacing.xl,
  },
  tagsSection: {
    marginBottom: spacing.xl,
  },
  tagsLabel: {
    ...typography.captionMedium,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.primaryLight + '18',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  tagText: {
    ...typography.caption,
    color: colors.primary,
  },
  deleteSection: {
    marginTop: spacing.lg,
  },
});
