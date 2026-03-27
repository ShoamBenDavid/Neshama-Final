import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from './ui/Card';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { JournalEntry } from '../services/api';
import { useTranslation } from '../i18n';

const MOOD_EMOJIS: Record<number, string> = {
  1: '😔',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😊',
};

interface JournalEntryCardProps {
  entry: JournalEntry;
  onPress?: () => void;
}

export default function JournalEntryCard({ entry, onPress }: JournalEntryCardProps) {
  const { t } = useTranslation();

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.moodBadge}>
          <Text style={styles.moodEmoji}>{MOOD_EMOJIS[entry.mood] || '😐'}</Text>
          <Text style={[styles.moodLabel, { color: colors.mood[entry.mood] || colors.text.secondary }]}>
            {colors.moodLabel[entry.mood] || t('common.unknown')}
          </Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{entry.date}</Text>
          <Text style={styles.time}>{entry.time}</Text>
        </View>
      </View>

      {entry.title && <Text style={styles.title} numberOfLines={1}>{entry.title}</Text>}
      <Text style={styles.content} numberOfLines={2}>{entry.content}</Text>

      {entry.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {entry.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {entry.tags.length > 3 && (
            <Text style={styles.moreTags}>+{entry.tags.length - 3}</Text>
          )}
        </View>
      )}

      {entry.anxietyLabel && (
        <View style={styles.anxietyRow}>
          <Ionicons name="pulse-outline" size={14} color={colors.text.tertiary} />
          <Text style={styles.anxietyText}>
            {t('journal.anxietyLabel', { label: entry.anxietyLabel })}
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 22,
    marginRight: spacing.sm,
  },
  moodLabel: {
    ...typography.captionMedium,
  },
  dateContainer: {
    alignItems: 'flex-end',
  },
  date: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  time: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontSize: 11,
  },
  title: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  content: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.primaryLight + '18',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  tagText: {
    ...typography.caption,
    color: colors.primary,
  },
  moreTags: {
    ...typography.caption,
    color: colors.text.tertiary,
    alignSelf: 'center',
  },
  anxietyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  anxietyText: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
});
