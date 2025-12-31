import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

import colors from '../config/colors';
interface ButtonProps {
  title: string;
  onPress: () => void;
  className?: string;
  activeOpacity?: number;
  color?: keyof typeof colors;
}

export default function Button({
  title,
  onPress,

  activeOpacity = 0.8,
  color = 'primary',
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={activeOpacity}
      style={[styles.button, { backgroundColor: colors[color as keyof typeof colors] as string }]}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    width: '100%',
    marginVertical: 10,
  },
  text: {
    color: colors.white,
    fontSize: 18,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
});
