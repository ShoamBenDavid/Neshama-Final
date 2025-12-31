import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Text from './Text';
import colors from '../config/colors';

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  onSave?: () => void;
  saveText?: string;
  saveDisabled?: boolean;
  style?: ViewStyle;
}

export default function ModalHeader({
  title,
  onClose,
  onSave,
  saveText = 'שמור',
  saveDisabled = false,
  style,
}: ModalHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={onClose}
        style={styles.closeButton}
      >
        <MaterialCommunityIcons
          name="close"
          size={24}
          color={colors.text.primary}
        />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      {onSave ? (
        <TouchableOpacity
          onPress={onSave}
          style={styles.saveButton}
          disabled={saveDisabled}
        >
          <Text
            style={[
              styles.saveText,
              saveDisabled && styles.saveTextDisabled,
            ]}
          >
            {saveText}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    width: 60,
    alignItems: 'flex-end',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  saveTextDisabled: {
    color: colors.text.light,
  },
  placeholder: {
    width: 60,
  },
});


