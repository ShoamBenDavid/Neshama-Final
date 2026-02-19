import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Text from './Text';
import colors from '../config/colors';

interface JournalEntryCardProps {
  id: string;
  date: string;
  time: string;
  mood: number;
  title?: string;
  content: string;
  tags?: string[];
  anxietyLabel?: string;
  onPress?: () => void;
}

const moodEmojis: { [key: number]: string } = {
  1: '😢',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😊',
};

const moodColors: { [key: number]: string } = {
  1: colors.danger,
  2: colors.orange,
  3: colors.warning,
  4: colors.info,
  5: colors.success,
};

const anxietyConfig: { [key: string]: { label: string; color: string; bg: string } } = {
  low: { label: 'חרדה נמוכה', color: colors.success, bg: colors.lightGreen },
  moderate: { label: 'חרדה בינונית', color: colors.orange, bg: colors.lightOrange },
  high: { label: 'חרדה גבוהה', color: colors.danger, bg: colors.lightPink },
};

export default function JournalEntryCard({
  date,
  time,
  mood,
  title,
  content,
  tags,
  anxietyLabel,
  onPress,
}: JournalEntryCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <View
          style={[
            styles.moodBadge,
            { backgroundColor: moodColors[mood] + '20' },
          ]}
        >
          <Text style={styles.moodEmoji}>{moodEmojis[mood]}</Text>
        </View>
      </View>

      {title && <Text style={styles.title}>{title}</Text>}
      
      <Text style={styles.content} numberOfLines={3}>
        {content}
      </Text>

      {anxietyLabel && anxietyConfig[anxietyLabel] && (
        <View
          style={[
            styles.anxietyBadge,
            { backgroundColor: anxietyConfig[anxietyLabel].bg },
          ]}
        >
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={14}
            color={anxietyConfig[anxietyLabel].color}
          />
          <Text
            style={[
              styles.anxietyText,
              { color: anxietyConfig[anxietyLabel].color },
            ]}
          >
            {anxietyConfig[anxietyLabel].label}
          </Text>
        </View>
      )}

      {tags && tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <MaterialCommunityIcons
          name="chevron-left"
          size={20}
          color={colors.text.secondary}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
      alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  dateContainer: {
    flex: 1,
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'left',
  },
  time: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
    textAlign: 'left',
  },
  moodBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'left',
  },
  content: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    textAlign: 'left',
  },
  anxietyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  anxietyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    justifyContent: 'flex-end',
  },
  tag: {
    backgroundColor: colors.lightPurple,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'flex-start',
    marginTop: 8,
  },
});

