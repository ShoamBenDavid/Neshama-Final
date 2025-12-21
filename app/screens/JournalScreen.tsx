import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput as RNTextInput,
  Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import Text from '../components/Text';
import MoodSelector from '../components/MoodSelector';
import JournalEntryCard from '../components/JournalEntryCard';
import SectionHeader from '../components/SectionHeader';
import BackButton from '../components/BackButton';
import HelpFooterButton from '../components/HelpFooterButton';
import colors from '../config/colors';

interface JournalEntry {
  id: string;
  date: string;
  time: string;
  mood: number;
  title?: string;
  content: string;
  tags?: string[];
}

// Sample data
const sampleEntries: JournalEntry[] = [
  {
    id: '1',
    date: 'היום, 2 בדצמבר',
    time: '14:30',
    mood: 4,
    title: 'יום טוב במיוחד',
    content:
      'היום הצלחתי להתמודד עם המצב בצורה טובה. הרגשתי יותר רגוע ושליט במחשבות שלי. התרגול של נשימות עמוקות ממש עזר.',
    tags: ['התקדמות', 'חיובי', 'נשימות'],
  },
  {
    id: '2',
    date: 'אתמול, 1 בדצמבר',
    time: '20:15',
    mood: 3,
    content:
      'היה יום מאתגר. היו רגעים קשים אבל הצלחתי לעבור אותם. חשוב לזכור שזה בסדר להרגיש ככה.',
    tags: ['רפלקציה'],
  },
  {
    id: '3',
    date: '30 בנובמבר',
    time: '09:45',
    mood: 5,
    title: 'התחלה מעולה ליום',
    content:
      'קמתי עם אנרגיה חיובית. מרגיש מוכן להתמודד עם היום. המדיטציה של הבוקר עזרה לי להתחיל נכון.',
    tags: ['בוקר', 'מדיטציה', 'אנרגיה'],
  },
  {
    id: '4',
    date: '29 בנובמבר',
    time: '18:20',
    mood: 2,
    content:
      'יום קשה. הרבה מחשבות שליליות. צריך להיות סבלני עם עצמי ולזכור שזה תהליך.',
    tags: ['מאתגר'],
  },
];

export default function JournalScreen() {
  const [entries] = useState<JournalEntry[]>(sampleEntries);
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [entryTitle, setEntryTitle] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [filterMood, setFilterMood] = useState<number | null>(null);

  const filteredEntries = filterMood
    ? entries.filter((entry) => entry.mood === filterMood)
    : entries;

  const handleSaveEntry = () => {
    // TODO: Save entry logic
    console.log('Saving entry:', {
      mood: selectedMood,
      title: entryTitle,
      content: entryContent,
    });
    setShowNewEntryModal(false);
    setSelectedMood(null);
    setEntryTitle('');
    setEntryContent('');
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <MaterialCommunityIcons
              name="book-open"
              size={32}
              color={colors.primary}
            />
            <View style={styles.headerText}>
            <View style={{alignItems: 'flex-start'}}>
              <Text style={styles.headerTitle}>יומן רגשי</Text>
              <Text style={styles.headerSubtitle}>
                  {entries.length} רשומות • {entries.filter(e => e.mood >= 4).length} ימים טובים
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.headerButtons}>
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
            <BackButton />
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>7</Text>
            <Text style={styles.statLabel}>רצף ימים</Text>
            <Text style={styles.statEmoji}>🔥</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5.9</Text>
            <Text style={styles.statLabel}>ממוצע מצב רוח</Text>
            <Text style={styles.statEmoji}>😊</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{entries.length}</Text>
            <Text style={styles.statLabel}>רשומות החודש</Text>
            <Text style={styles.statEmoji}>📝</Text>
          </View>
        </View>

        {/* Mood Filter */}
        <View style={styles.moodFilterContainer}>
          <Text style={styles.filterTitle}>סינון לפי מצב רוח:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.moodFilter}
          >
            <TouchableOpacity
              style={[
                styles.moodFilterButton,
                !filterMood && styles.moodFilterButtonActive,
              ]}
              onPress={() => setFilterMood(null)}
            >
              <Text
                style={[
                  styles.moodFilterText,
                  !filterMood && styles.moodFilterTextActive,
                ]}
              >
                הכל
              </Text>
            </TouchableOpacity>
            {[5, 4, 3, 2, 1].map((mood) => {
              const emojis = ['😢', '😕', '😐', '🙂', '😊'];
              return (
                <TouchableOpacity
                  key={mood}
                  style={[
                    styles.moodFilterButton,
                    filterMood === mood && styles.moodFilterButtonActive,
                  ]}
                  onPress={() => setFilterMood(mood)}
                >
                  <Text style={styles.moodFilterEmoji}>{emojis[mood - 1]}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

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
          {filteredEntries.map((entry) => (
            <JournalEntryCard
              key={entry.id}
              {...entry}
              onPress={() => console.log('View entry:', entry.id)}
            />
          ))}
        </View>

        <View style={styles.bottomSpacing} />
        <HelpFooterButton />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowNewEntryModal(true)}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="plus" size={32} color={colors.white} />
      </TouchableOpacity>

      {/* New Entry Modal */}
      <Modal
        visible={showNewEntryModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNewEntryModal(false)}
      >
        <Screen style={styles.modalScreen}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowNewEntryModal(false)}
              style={styles.modalCloseButton}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={colors.text.primary}
              />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>רשומה חדשה</Text>
            <TouchableOpacity
              onPress={handleSaveEntry}
              style={styles.modalSaveButton}
              disabled={!selectedMood || !entryContent}
            >
              <Text
                style={[
                  styles.modalSaveText,
                  (!selectedMood || !entryContent) && styles.modalSaveTextDisabled,
                ]}
              >
                שמור
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <MoodSelector
              selectedMood={selectedMood}
              onSelectMood={setSelectedMood}
            />

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>כותרת (אופציונלי)</Text>
              <RNTextInput
                style={styles.titleInput}
                placeholder="הוסף כותרת..."
                placeholderTextColor={colors.text.light}
                value={entryTitle}
                onChangeText={setEntryTitle}
                textAlign="right"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>מה עבר עליך היום?</Text>
              <RNTextInput
                style={styles.contentInput}
                placeholder="שתף את המחשבות והרגשות שלך..."
                placeholderTextColor={colors.text.light}
                value={entryContent}
                onChangeText={setEntryContent}
                multiline
                numberOfLines={10}
                textAlign="right"
                textAlignVertical="top"
              />
            </View>

            <View style={styles.tipsCard}>
              <MaterialCommunityIcons
                name="lightbulb-outline"
                size={20}
                color={colors.warning}
              />
              <Text style={styles.tipsText}>
                טיפ: כתוב בחופשיות ללא שיפוט. זה המרחב הבטוח שלך.
              </Text>
            </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'right',
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 2,
    textAlign: 'right',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.lightPurple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  statEmoji: {
    fontSize: 20,
  },
  divider: {
    width: 1,
    backgroundColor: colors.gray[200],
    marginHorizontal: 12,
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
    textAlign: 'right',
  },
  moodFilter: {
    flexDirection: 'row',
  },
  moodFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    marginLeft: 8,
  },
  moodFilterButtonActive: {
    backgroundColor: colors.primary,
  },
  moodFilterText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  moodFilterTextActive: {
    color: colors.white,
  },
  moodFilterEmoji: {
    fontSize: 20,
  },
  section: {
    paddingHorizontal: 20,
  },
  bottomSpacing: {
    height: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalScreen: {
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  modalCloseButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  modalSaveButton: {
    width: 60,
    alignItems: 'flex-end',
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  modalSaveTextDisabled: {
    color: colors.text.light,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'right',
  },
  titleInput: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  contentInput: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: colors.text.primary,
    minHeight: 200,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  tipsCard: {
    flexDirection: 'row',
    backgroundColor: colors.lightOrange,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  tipsText: {
    flex: 1,
    fontSize: 13,
    color: colors.text.primary,
    textAlign: 'right',
    lineHeight: 18,
  },
});

