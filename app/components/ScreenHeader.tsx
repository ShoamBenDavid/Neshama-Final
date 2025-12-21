import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Text from './Text';
import BackButton from './BackButton';
import colors from '../config/colors';

interface ScreenHeaderProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  rightAction?: ReactNode;
}

export default function ScreenHeader({
  icon,
  title,
  subtitle,
  showBackButton = true,
  rightAction,
}: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <MaterialCommunityIcons
          name={icon}
          size={32}
          color={colors.primary}
        />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.headerSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      <View style={styles.headerActions}>
        {rightAction}
        {showBackButton && <BackButton />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'left',
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 2,
    textAlign: 'left',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

