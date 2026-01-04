import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../config/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  showClearButton?: boolean;
  style?: ViewStyle;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'חיפוש...',
  showClearButton = true,
  style,
}: SearchBarProps) {
  return (
    <View style={[styles.container, style]}>
      <MaterialCommunityIcons
        name="magnify"
        size={20}
        color={colors.text.secondary}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.text.light}
        value={value}
        onChangeText={onChangeText}
        textAlign="right"
      />
      {showClearButton && value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText('')}
          style={styles.clearButton}
        >
          <MaterialCommunityIcons
            name="close-circle"
            size={20}
            color={colors.text.secondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text.primary,
  },
  clearButton: {
    padding: 4,
  },
});



