import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Text from './Text';
import colors from '../config/colors';

interface NavItem {
  id: string;
  icon: string;
  label: string;
  onPress: () => void;
}

interface NavigationSidebarProps {
  activeRoute?: string;
}

export default function NavigationSidebar({
  activeRoute = 'home',
}: NavigationSidebarProps) {
  const navItems: NavItem[] = [
    {
      id: 'home',
      icon: 'home',
      label: 'בית',
      onPress: () => console.log('Home'),
    },
    {
      id: 'journal',
      icon: 'book-open',
      label: 'יומן רגשי',
      onPress: () => console.log('Journal'),
    },
    {
      id: 'chat',
      icon: 'message-text',
      label: 'שיחה תומכת',
      onPress: () => console.log('Chat'),
    },
    {
      id: 'content',
      icon: 'meditation',
      label: 'תכנים',
      onPress: () => console.log('Content'),
    },
    {
      id: 'forum',
      icon: 'account-group',
      label: 'פורום',
      onPress: () => console.log('Forum'),
    },
    {
      id: 'support',
      icon: 'heart-outline',
      label: 'מרכז תמיכה',
      onPress: () => console.log('Support'),
    },
  ];

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const isActive = item.id === activeRoute;
        return (
          <TouchableOpacity
            key={item.id}
            style={[styles.navItem, isActive && styles.navItemActive]}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={item.icon as any}
              size={20}
              color={isActive ? colors.primary : colors.text.secondary}
            />
            <Text
              style={[
                styles.navLabel,
                isActive && styles.navLabelActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingVertical: 20,
    paddingHorizontal: 12,
    gap: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 12,
  },
  navItemActive: {
    backgroundColor: colors.lightPurple,
  },
  navLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  navLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});

