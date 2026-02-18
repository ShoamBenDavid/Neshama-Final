import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../config/colors';
interface ScreenProps {
  children?: React.ReactNode;
  style?: any;
}

export default function Screen({ children, style }: ScreenProps) {
  return <SafeAreaView style={[styles.screen, style]}>{children}</SafeAreaView>;
} 
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
});