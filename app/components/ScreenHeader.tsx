import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Text from './Text';
import BackButton from './BackButton';
import colors from '../config/colors';

interface ScreenHeaderProps {
  icon?: React.ReactNode;
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor?: string;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  rightContent?: React.ReactNode;
  style?: ViewStyle;
}

export default function ScreenHeader({
  icon,
  iconName,
  iconColor = colors.primary,
  title,
  subtitle,
  showBackButton = true,
  rightContent,
  style,
}: ScreenHeaderProps) {
  const renderIcon = () => {
    if (icon) return icon;
    if (iconName) {
      return (
        <MaterialCommunityIcons
          name={iconName}
          size={32}
          color={iconColor}
        />
      );
    }
    return null;
  };

  return (
    <View style={[styles.header, style]}>
      <View style={styles.headerContent}>
        {renderIcon()}
        <View style={styles.headerText}>
          <View style={styles.textContainer}>
            <Text style={styles.headerTitle}>{title}</Text>
            {subtitle && (
              <Text style={styles.headerSubtitle}>{subtitle}</Text>
            )}
          </View>
        </View>
      </View>
      <View style={styles.rightSection}>
        {rightContent}
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
  },
  textContainer: {
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
    lineHeight: 20,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});


