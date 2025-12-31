import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Text from './Text';
import colors from '../config/colors';

interface InfoBannerProps {
  icon?: React.ReactNode;
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor?: string;
  title?: string;
  message: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

export default function InfoBanner({
  icon,
  iconName = 'lightbulb-outline',
  iconColor = colors.warning,
  title,
  message,
  backgroundColor = colors.lightOrange,
  style,
}: InfoBannerProps) {
  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      {icon || (
        <MaterialCommunityIcons
          name={iconName}
          size={20}
          color={iconColor}
        />
      )}
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
    textAlign: 'left',
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    color: colors.text.primary,
    textAlign: 'left',
    lineHeight: 18,
  },
});


