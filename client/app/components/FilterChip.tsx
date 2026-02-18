import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Text from './Text';
import colors from '../config/colors';

interface FilterChipProps {
  label: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  isActive: boolean;
  onPress: () => void;
  activeColor?: string;
  inactiveColor?: string;
}

export default function FilterChip({
  label,
  icon,
  isActive,
  onPress,
  activeColor = colors.primary,
  inactiveColor = colors.gray[100],
}: FilterChipProps) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        { backgroundColor: isActive ? activeColor : inactiveColor },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={16}
          color={isActive ? colors.white : colors.text.secondary}
        />
      )}
      <Text
        style={[
          styles.label,
          { color: isActive ? colors.white : colors.text.secondary },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});

