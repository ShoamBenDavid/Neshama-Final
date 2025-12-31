import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import colors from '../config/colors';

interface BackButtonProps {
  onPress?: () => void;
  color?: string;
  size?: number;
}

export default function BackButton({ 
  onPress, 
  color = colors.primary,
  size = 24 
}: BackButtonProps) {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons
        name="arrow-right"
        size={size}
        color={color}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.lightPurple,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
