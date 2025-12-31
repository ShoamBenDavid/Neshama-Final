import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Text from './Text';
import colors from '../config/colors';

interface EmptyStateProps {
  icon?: React.ReactNode;
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle?: string;
  style?: ViewStyle;
}

export default function EmptyState({
  icon,
  iconName = 'folder-outline',
  title,
  subtitle,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      {icon || (
        <MaterialCommunityIcons
          name={iconName}
          size={64}
          color={colors.text.light}
        />
      )}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.secondary,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.light,
    marginTop: 8,
    textAlign: 'center',
  },
});



