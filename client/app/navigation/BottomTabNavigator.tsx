import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomePageScreen from '../screens/HomePageScreen';
import DashboardScreen from '../screens/DashboardScreen';
import JournalScreen from '../screens/JournalScreen';
import ForumScreen from '../screens/ForumScreen';
import SupportCenterScreen from '../screens/SupportCenterScreen';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, shadows } from '../theme/spacing';
import { useTranslation } from '../i18n';

export type BottomTabParamList = {
  HomePage: undefined;
  Dashboard: undefined;
  Journal: undefined;
  Forum: undefined;
  SupportCenter: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const TAB_ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  HomePage: { active: 'home', inactive: 'home-outline' },
  Dashboard: { active: 'grid', inactive: 'grid-outline' },
  Journal: { active: 'book', inactive: 'book-outline' },
  Forum: { active: 'people', inactive: 'people-outline' },
  SupportCenter: { active: 'heart', inactive: 'heart-outline' },
};

export default function BottomTabNavigator() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.tab.active,
        tabBarInactiveTintColor: colors.tab.inactive,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ color, size, focused }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.active : icons.inactive;
          return (
            <View style={focused ? styles.activeIconWrapper : undefined}>
              <Ionicons name={iconName} size={22} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="HomePage"
        component={HomePageScreen}
        options={{ tabBarLabel: t('tabs.home') }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarLabel: t('tabs.dashboard') }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalScreen}
        options={{ tabBarLabel: t('tabs.journal') }}
      />
      <Tab.Screen
        name="Forum"
        component={ForumScreen}
        options={{ tabBarLabel: t('tabs.community') }}
      />
      <Tab.Screen
        name="SupportCenter"
        component={SupportCenterScreen}
        options={{ tabBarLabel: t('tabs.support') }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.tab.background,
    borderTopWidth: 1,
    height: 88,
    paddingTop: spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.sm,
    ...shadows.md,
  },
  tabLabel: {
    ...typography.caption,
    fontSize: 11,
    marginTop: 2,
  },
  activeIconWrapper: {
    backgroundColor: colors.primary + '10',
    borderRadius: 16,
  },
});
