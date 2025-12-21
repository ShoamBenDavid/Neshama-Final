import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import Text from './Text';
import colors from '../config/colors';

interface FormInputProps extends TextInputProps {
  label: string;
  multiline?: boolean;
}

export default function FormInput({
  label,
  multiline = false,
  ...props
}: FormInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
        ]}
        placeholderTextColor={colors.text.light}
        textAlign="right"
        textAlignVertical={multiline ? 'top' : 'center'}
        multiline={multiline}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'right',
  },
  input: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  multilineInput: {
    minHeight: 200,
    fontSize: 15,
  },
});

