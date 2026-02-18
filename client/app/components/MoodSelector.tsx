import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Text from './Text';
import colors from '../config/colors';

interface MoodOption {
  id: number;
  emoji: string;
  label: string;
  color: string;
}

interface MoodSelectorProps {
  selectedMood: number | null;
  onSelectMood: (moodId: number) => void;
}

const moodOptions: MoodOption[] = [
  { id: 1, emoji: '😢', label: 'עצוב', color: colors.danger },
  { id: 2, emoji: '😕', label: 'לא טוב', color: colors.orange },
  { id: 3, emoji: '😐', label: 'בסדר', color: colors.warning },
  { id: 4, emoji: '🙂', label: 'טוב', color: colors.info },
  { id: 5, emoji: '😊', label: 'מצוין', color: colors.success },
];

export default function MoodSelector({
  selectedMood,
  onSelectMood,
}: MoodSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>איך אתה מרגיש היום?</Text>
      <View style={styles.moodContainer}>
        {moodOptions.map((mood) => {
          const isSelected = selectedMood === mood.id;
          return (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.moodButton,
                isSelected && {
                  backgroundColor: mood.color + '20',
                  borderColor: mood.color,
                  borderWidth: 2,
                },
              ]}
              onPress={() => onSelectMood(mood.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{mood.emoji}</Text>
              <Text
                style={[
                  styles.moodLabel,
                  isSelected && { color: mood.color, fontWeight: 'bold' },
                ]}
              >
                {mood.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: 'left',
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  moodButton: {
    flex: 1,
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  emoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 11,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

