import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import Text from '../components/Text';
import MoodSelector from '../components/MoodSelector';
import JournalEntryCard from '../components/JournalEntryCard';
import SectionHeader from '../components/SectionHeader';
import ScreenHeader from '../components/ScreenHeader';
import ModalHeader from '../components/ModalHeader';
import FormInput from '../components/FormInput';
import InfoBanner from '../components/InfoBanner';
import QuickStatsCard from '../components/QuickStatsCard';
import FloatingActionButton from '../components/FloatingActionButton';
import FilterChipList, { FilterChip } from '../components/FilterChipList';
import HelpFooterButton from '../components/HelpFooterButton';
import EmptyState from '../components/EmptyState';
import colors from '../config/colors';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchJournalEntries, createJournalEntry, fetchJournalStats } from '../store/slices/journalSlice';

const emojis = ['😢', '😕', '😐', '🙂', '😊'];

export default function JournalScreen() {
  const dispatch = useAppDispatch();
  const { entries, stats, isLoading, isCreating, error } = useAppSelector((state) => state.journal);

  const [showNewEntryModal, setShowNewEntryModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [entryTitle, setEntryTitle] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [filterMood, setFilterMood] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchJournalEntries());
    dispatch(fetchJournalStats());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert('שגיאה', error);
    }
  }, [error]);

  const filteredEntries = filterMood
    ? entries.filter((entry) => entry.mood === parseInt(filterMood))
    : entries;

  const handleSaveEntry = async () => {
    if (!selectedMood || !entryContent.trim()) {
      Alert.alert('שגיאה', 'אנא בחר מצב רוח וכתוב תוכן');
      return;
    }

    const result = await dispatch(createJournalEntry({
      mood: selectedMood,
      title: entryTitle.trim() || undefined,
      content: entryContent.trim(),
      tags: [],
    }));

    if (createJournalEntry.fulfilled.match(result)) {
      setShowNewEntryModal(false);
      setSelectedMood(null);
      setEntryTitle('');
      setEntryContent('');
      // Refresh stats after creating entry
      dispatch(fetchJournalStats());
    }
  };

  const moodFilterChips: FilterChip[] = [
    { id: 'all', label: 'הכל', activeColor: colors.primary },
    ...emojis.map((emoji, index) => ({
      id: String(index + 1),
      label: emoji,
      activeColor: colors.primary,
    })),
  ];

  const displayStats = [
    { value: stats?.weeklyStreak?.split('/')[0] || '0', label: 'רצף ימים', emoji: '🔥' },
    { value: stats?.avgMood?.split('/')[0] || '0', label: 'ממוצע מצב רוח', emoji: '😊' },
    { value: String(entries.length), label: 'רשומות החודש', emoji: '📝' },
  ];

  const filterButton = (
    <TouchableOpacity
      style={styles.filterButton}
      onPress={() => setFilterMood(null)}
    >
      <MaterialCommunityIcons
        name="filter-variant"
        size={24}
        color={colors.primary}
      />
    </TouchableOpacity>
  );

  return (
    <Screen style={styles.screen}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ScreenHeader
          iconName="book-open"
          title="יומן רגשי"
          subtitle={`${entries.length} רשומות • ${entries.filter(e => e.mood >= 4).length} ימים טובים`}
          rightContent={filterButton}
        />

        {/* Quick Stats */}
        <QuickStatsCard stats={displayStats} />

        {/* Mood Filter */}
        <View style={styles.moodFilterContainer}>
          <Text style={styles.filterTitle}>סינון לפי מצב רוח:</Text>
          <FilterChipList
            chips={moodFilterChips}
            selectedId={filterMood || 'all'}
            onSelect={(id) => setFilterMood(id === 'all' ? null : id)}
            allowDeselect={false}
            style={styles.moodFilter}
          />
        </View>

        {/* Loading State */}
        {isLoading && entries.length === 0 && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>טוען רשומות...</Text>
          </View>
        )}

        {/* Entries List */}
        <View style={styles.section}>
          <SectionHeader
            icon={
              <MaterialCommunityIcons
                name="history"
                size={20}
                color={colors.primary}
              />
            }
            title={`רשומות אחרונות (${filteredEntries.length})`}
          />
          {filteredEntries.length === 0 && !isLoading ? (
            <EmptyState
              iconName="book-open-outline"
              title="אין רשומות עדיין"
              subtitle="התחל לכתוב את היומן הרגשי שלך"
            />
          ) : (
            filteredEntries.map((entry) => (
              <JournalEntryCard
                key={entry.id}
                id={entry.id}
                date={entry.date}
                time={entry.time}
                mood={entry.mood}
                title={entry.title}
                content={entry.content}
                tags={entry.tags}
                onPress={() => console.log('View entry:', entry.id)}
              />
            ))
          )}
        </View>

        <View style={styles.bottomSpacing} />
        <HelpFooterButton />
      </ScrollView>

      {/* Floating Action Button */}
      <FloatingActionButton
        onPress={() => setShowNewEntryModal(true)}
        iconName="plus"
      />

      {/* New Entry Modal */}
      <Modal
        visible={showNewEntryModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNewEntryModal(false)}
      >
        <Screen style={styles.modalScreen}>
          <ModalHeader
            title="רשומה חדשה"
            onClose={() => setShowNewEntryModal(false)}
            onSave={handleSaveEntry}
            saveDisabled={!selectedMood || !entryContent || isCreating}
          />

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {isCreating && (
              <View style={styles.creatingOverlay}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.creatingText}>שומר...</Text>
              </View>
            )}

            <MoodSelector
              selectedMood={selectedMood}
              onSelectMood={setSelectedMood}
            />

            <FormInput
              label="כותרת (אופציונלי)"
              placeholder="הוסף כותרת..."
              value={entryTitle}
              onChangeText={setEntryTitle}
            />

            <FormInput
              label="מה עבר עליך היום?"
              placeholder="שתף את המחשבות והרגשות שלך..."
              value={entryContent}
              onChangeText={setEntryContent}
              multiline
              numberOfLines={10}
              minHeight={200}
            />

            <InfoBanner
              iconName="lightbulb-outline"
              iconColor={colors.warning}
              backgroundColor={colors.lightOrange}
              message="טיפ: כתוב בחופשיות ללא שיפוט. זה המרחב הבטוח שלך."
            />
          </ScrollView>
        </Screen>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.lightPurple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodFilterContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: 'left',
  },
  moodFilter: {
    marginBottom: 0,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: colors.text.secondary,
  },
  section: {
    paddingHorizontal: 20,
  },
  bottomSpacing: {
    height: 100,
  },
  modalScreen: {
    backgroundColor: colors.background,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  creatingOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: colors.lightPurple,
    borderRadius: 8,
    marginBottom: 16,
  },
  creatingText: {
    marginLeft: 8,
    color: colors.primary,
    fontWeight: '600',
  },
});
