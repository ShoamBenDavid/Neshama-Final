import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../config/colors';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: React.ReactNode;
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor?: string;
  backgroundColor?: string;
  size?: 'small' | 'medium' | 'large';
  position?: 'left' | 'right';
  style?: ViewStyle;
}

const sizeMap = {
  small: { button: 48, icon: 24 },
  medium: { button: 56, icon: 28 },
  large: { button: 64, icon: 32 },
};

export default function FloatingActionButton({
  onPress,
  icon,
  iconName = 'plus',
  iconColor = colors.white,
  backgroundColor = colors.primary,
  size = 'large',
  position = 'left',
  style,
}: FloatingActionButtonProps) {
  const dimensions = sizeMap[size];

  return (
    <TouchableOpacity
      style={[
        styles.fab,
        {
          width: dimensions.button,
          height: dimensions.button,
          borderRadius: dimensions.button / 2,
          backgroundColor,
          [position === 'left' ? 'left' : 'right']: 24,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon || (
        <MaterialCommunityIcons
          name={iconName}
          size={dimensions.icon}
          color={iconColor}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});



