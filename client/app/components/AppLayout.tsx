import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import NavigationSidebar from './NavigationSidebar';
import colors from '../config/colors';

interface AppLayoutProps {
  children: React.ReactNode;
  activeRoute?: string;
  showSidebar?: boolean;
}

export default function AppLayout({
  children,
  activeRoute = 'home',
  showSidebar = true,
}: AppLayoutProps) {
  const { width } = useWindowDimensions();
  const isTabletOrLarger = width >= 768;

  return (
    <View style={styles.container}>
      {children}
      {showSidebar && isTabletOrLarger && (
        <View style={styles.sidebar}>
          <NavigationSidebar activeRoute={activeRoute} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.background,
  },
  sidebar: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 200,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
});

