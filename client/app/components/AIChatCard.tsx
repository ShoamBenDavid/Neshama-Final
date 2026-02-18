import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Text from './Text';
import colors from '../config/colors';

interface AIChatCardProps {
  onPress: () => void;
}

export default function AIChatCard({ onPress }: AIChatCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name="shield-check-outline"
          size={32}
          color={colors.white}
        />
      </View>

      <Text style={styles.title}>רוצה לדבר עם מישהו עכשיו?</Text>
      <Text style={styles.subtitle}>
   הבינה המלאכותית שלנו זמין 24/7
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons
          name="message-text"
          size={18}
          color={colors.primary}
        />
        <Text style={styles.buttonText}>צ'אט עם NeshmaAI</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
  },
});

