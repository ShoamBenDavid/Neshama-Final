import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Text from './Text';
import colors from '../config/colors';

interface SupportCardProps {
  title: string;
  subtitle: string;
  phone: string;
  hours?: string;
  available247?: boolean;
  tags: string[];
  website?: string;
  borderColor: string;
  onCall?: () => void;
}

export default function SupportCard({
  title,
  subtitle,
  phone,
  hours,
  available247,
  tags,
  website,
  borderColor,
  onCall,
}: SupportCardProps) {
  const handleCall = () => {
    if (onCall) {
      onCall();
    } else {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const handleWebsite = () => {
    if (website) {
      Linking.openURL(website);
    }
  };

  return (
    <View style={[styles.card, { borderTopColor: borderColor, borderTopWidth: 4 }]}>
      {/* Header with phone button */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <TouchableOpacity
          style={[styles.phoneButton, { backgroundColor: borderColor }]}
          onPress={handleCall}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="phone" size={18} color={colors.white} />
          <Text style={styles.phoneButtonText}>{phone}</Text>
        </TouchableOpacity>
      </View>

      {/* Hours */}
      {(hours || available247) && (
        <View style={styles.hoursContainer}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={16}
            color={colors.text.secondary}
          />
          <Text style={styles.hoursText}>
            {available247 ? '24 שעות ביממה, 7 ימים בשבוע' : hours}
          </Text>
        </View>
      )}

      {/* Tags */}
      <View style={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* Website link */}
      {website && (
        <TouchableOpacity
          style={styles.websiteButton}
          onPress={handleWebsite}
          activeOpacity={0.7}
        >
          <Text style={styles.websiteText}>לאתר</Text>
          <MaterialCommunityIcons
            name="open-in-new"
            size={16}
            color={colors.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
    textAlign: 'left',
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  phoneButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    justifyContent: 'flex-end',
  },
  hoursText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
    justifyContent: 'flex-end',
  },
  tag: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    color: colors.text.secondary,
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-end',
  },
  websiteText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
});

