import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import Text from '../components/Text';
import MoodSelector from '../components/MoodSelector';
import JournalEntryCard from '../components/JournalEntryCard';
import SectionHeader from '../components/SectionHeader';
import ScreenHeader from '../components/ScreenHeader';
import ModalHeader from '../components/ModalHeader';
import FormInput from '../components/FormInput';
import InfoCard from '../components/InfoCard';
import FAB from '../components/FAB';
import QuickStatsRow from '../components/QuickStatsRow';
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

  const stats = [
    { value: '7', label: 'רצף ימים', emoji: '🔥' },
    { value: '5.9', label: 'ממוצע מצב רוח', emoji: '😊' },
    { value: entries.length, label: 'רשומות החודש', emoji: '📝' },
  ];

  return (
    <Screen style={styles.screen}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          icon="book-open"
          title="יומן רגשי"
          subtitle={`${entries.length} רשומות • ${entries.filter(e => e.mood >= 4).length} ימים טובים`}
          rightAction={
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
          }
        />

        <QuickStatsRow stats={stats} />

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

      <FAB onPress={() => setShowNewEntryModal(true)} />

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
            saveDisabled={!selectedMood || !entryContent}
          />

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
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
            />

            <InfoCard
              icon="lightbulb-outline"
              message="טיפ: כתוב בחופשיות ללא שיפוט. זה המרחב הבטוח שלך."
              variant="tip"
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
  modalScreen: {
    backgroundColor: colors.background,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
