import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { ScreenWrapper, Header, Button, Card } from '../components/ui';
import MoodSelector from '../components/MoodSelector';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createJournalEntry } from '../store/slices/journalSlice';
import { useTranslation } from '../i18n';
import type { RootStackParamList } from '../navigation/StackNavigator';

type RouteParams = RouteProp<RootStackParamList, 'CreateJournal'>;

const SUGGESTED_TAGS = ['gratitude', 'anxiety', 'sleep', 'exercise', 'therapy', 'work', 'relationships', 'mindfulness'];

export default function CreateJournalScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteParams>();
  const dispatch = useAppDispatch();
  const { isCreating } = useAppSelector((state) => state.journal);
  const { t } = useTranslation();

  const [mood, setMood] = useState<number | null>(route.params?.initialMood ?? null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSave = async () => {
    if (!mood) {
      Alert.alert(t('journal.missingMood'), t('journal.missingMoodMessage'));
      return;
    }
    if (!content.trim()) {
      Alert.alert(t('journal.missingContent'), t('journal.missingContentMessage'));
      return;
    }

    const result = await dispatch(
      createJournalEntry({
        mood,
        title: title.trim() || undefined,
        content: content.trim(),
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      }),
    );

    if (createJournalEntry.fulfilled.match(result)) {
      navigation.goBack();
    } else {
      Alert.alert(t('common.error'), t('journal.saveError'));
    }
  };

  return (
    <ScreenWrapper>
      <Header title={t('journal.newEntry')} showBack />

      <MoodSelector selected={mood} onSelect={setMood} />

      <View style={styles.field}>
        <Text style={styles.label}>{t('journal.titleOptional')}</Text>
        <TextInput
          style={styles.titleInput}
          placeholder={t('journal.titlePlaceholder')}
          placeholderTextColor={colors.text.tertiary}
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>{t('journal.whatsOnYourMind')}</Text>
        <TextInput
          style={styles.contentInput}
          placeholder={t('journal.contentPlaceholder')}
          placeholderTextColor={colors.text.tertiary}
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          maxLength={5000}
        />
        <Text style={styles.charCount}>{content.length}/5000</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>{t('journal.tagsOptional')}</Text>
        <View style={styles.tagsContainer}>
          {SUGGESTED_TAGS.map((tag) => {
            const isActive = selectedTags.includes(tag);
            return (
              <View
                key={tag}
                style={[styles.tag, isActive && styles.tagActive]}
              >
                <Text
                  style={[styles.tagText, isActive && styles.tagTextActive]}
                  onPress={() => toggleTag(tag)}
                >
                  {t(`tags.${tag}` as any)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <Button
        title={t('journal.saveEntry')}
        onPress={handleSave}
        loading={isCreating}
        size="lg"
        style={styles.saveButton}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: spacing.xl,
  },
  label: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  titleInput: {
    ...typography.body,
    color: colors.text.primary,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    ...shadows.sm,
  },
  contentInput: {
    ...typography.body,
    color: colors.text.primary,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    minHeight: 160,
    lineHeight: 24,
    ...shadows.sm,
  },
  charCount: {
    ...typography.caption,
    color: colors.text.tertiary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagActive: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  tagText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  tagTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  saveButton: {
    marginTop: spacing.md,
  },
});
