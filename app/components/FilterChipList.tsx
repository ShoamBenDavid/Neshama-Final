import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Text from './Text';
import colors from '../config/colors';

export interface FilterChip {
  id: string;
  label: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  color?: string;
  activeColor?: string;
  backgroundColor?: string;
}

interface FilterChipListProps {
  chips: FilterChip[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  allowDeselect?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

export default function FilterChipList({
  chips,
  selectedId,
  onSelect,
  allowDeselect = true,
  style,
  contentContainerStyle,
}: FilterChipListProps) {
  const handlePress = (id: string) => {
    if (allowDeselect && selectedId === id) {
      onSelect(null);
    } else {
      onSelect(id);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      >
        {chips.map((chip) => {
          const isActive = selectedId === chip.id;
          const activeColor = chip.activeColor || chip.color || colors.primary;
          const bgColor = isActive
            ? activeColor
            : chip.backgroundColor || colors.gray[100];

          return (
            <TouchableOpacity
              key={chip.id}
              style={[styles.chip, { backgroundColor: bgColor }]}
              onPress={() => handlePress(chip.id)}
              activeOpacity={0.7}
            >
              {chip.icon && (
                <MaterialCommunityIcons
                  name={chip.icon}
                  size={16}
                  color={isActive ? colors.white : activeColor}
                />
              )}
              <Text
                style={[
                  styles.chipText,
                  { color: isActive ? colors.white : chip.color || colors.text.secondary },
                ]}
              >
                {chip.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
});


