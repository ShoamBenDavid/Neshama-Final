import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper, LoadingState, ErrorState, EmptyState } from '../components/ui';
import JournalEntryCard from '../components/JournalEntryCard';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchJournalEntries } from '../store/slices/journalSlice';
import { useTranslation } from '../i18n';
import type { RootStackParamList } from '../navigation/StackNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function JournalScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { entries, isLoading, error } = useAppSelector((state) => state.journal);
  const { t } = useTranslation();

  const loadEntries = useCallback(() => {
    dispatch(fetchJournalEntries({}));
  }, [dispatch]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadEntries);
    return unsubscribe;
  }, [navigation, loadEntries]);

  if (isLoading && entries.length === 0) {
    return <LoadingState message={t('journal.loadingJournal')} />;
  }

  if (error && entries.length === 0) {
    return <ErrorState message={error} onRetry={loadEntries} />;
  }

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t('journal.title')}</Text>
          <Text style={styles.subtitle}>{t('journal.entriesCount', { count: entries.length })}</Text>
        </View>
      </View>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JournalEntryCard
            entry={item}
            onPress={() => navigation.navigate('JournalEntry', { entryId: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="book-outline"
            title={t('journal.noEntries')}
            message={t('journal.noEntriesSubtitle')}
            actionLabel={t('journal.writeFirstEntry')}
            onAction={() => navigation.navigate('CreateJournal', {})}
          />
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateJournal', {})}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={colors.text.inverse} />
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xxs,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['5xl'],
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
});
