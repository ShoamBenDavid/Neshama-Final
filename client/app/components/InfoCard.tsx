import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Text from './Text';
import colors from '../config/colors';

type InfoCardVariant = 'tip' | 'success' | 'warning' | 'info';

interface InfoCardProps {
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  title?: string;
  message: string;
  variant?: InfoCardVariant;
}

const variantStyles = {
  tip: {
    backgroundColor: colors.lightOrange,
    iconColor: colors.warning,
  },
  success: {
    backgroundColor: colors.lightGreen,
    iconColor: colors.success,
  },
  warning: {
    backgroundColor: colors.lightOrange,
    iconColor: colors.warning,
  },
  info: {
    backgroundColor: colors.lightPurple,
    iconColor: colors.primary,
  },
};

export default function InfoCard({
  icon = 'lightbulb-outline',
  title,
  message,
  variant = 'tip',
}: InfoCardProps) {
  const { backgroundColor, iconColor } = variantStyles[variant];

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
      <View style={styles.textContainer}>
        {title && <Text style={styles.title}>{title}</Text>}
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'right',
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    color: colors.text.primary,
    textAlign: 'right',
    lineHeight: 18,
  },
});

