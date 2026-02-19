import React from 'react';
import { View, TextInput, StyleSheet, ViewStyle, TextInputProps, I18nManager } from 'react-native';
import Text from './Text';
import colors from '../config/colors';

interface FormInputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  multiline?: boolean;
  minHeight?: number;
}

export default function FormInput({
  label,
  containerStyle,
  inputStyle,
  multiline = false,
  minHeight,
  ...textInputProps
}: FormInputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          minHeight ? { minHeight } : null,
          inputStyle,
        ]}
        placeholderTextColor={colors.text.light}
        textAlign="right"
        textAlignVertical={multiline ? 'top' : 'center'}
        multiline={multiline}
        {...textInputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'left',
  },
  input: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.gray[200],
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  multilineInput: {
    minHeight: 200,
    textAlignVertical: 'top',
  },
});



