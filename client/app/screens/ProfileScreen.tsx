import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper, Header, Card, Button } from '../components/ui';
import StatCard from '../components/StatCard';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logoutUser } from '../store/slices/authSlice';
import { fetchJournalStats } from '../store/slices/journalSlice';
import type { RootStackParamList } from '../navigation/StackNavigator';
import { useTranslation } from '../i18n';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { stats } = useAppSelector((state) => state.journal);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchJournalStats());
  }, [dispatch]);

  const handleLogout = () => {
    Alert.alert(t('profile.logOut'), t('profile.logOutConfirmation'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('profile.logOut'),
        style: 'destructive',
        onPress: () => dispatch(logoutUser()),
      },
    ]);
  };

  const menuItems = [
    {
      icon: 'settings-outline' as const,
      label: t('profile.settingsMenu'),
      onPress: () => navigation.navigate('Settings'),
    },
    {
      icon: 'notifications-outline' as const,
      label: t('profile.notifications'),
      onPress: () => navigation.navigate('NotificationOptions'),
    },
    {
      icon: 'shield-checkmark-outline' as const,
      label: t('profile.privacySecurity'),
      onPress: () => navigation.navigate('PrivacySecurity'),
    },
    {
      icon: 'help-circle-outline' as const,
      label: t('profile.helpFAQ'),
      onPress: () => navigation.navigate('HelpFAQ'),
    },
    {
      icon: 'information-circle-outline' as const,
      label: t('profile.aboutNeshama'),
      onPress: () => navigation.navigate('AboutNeshama'),
    },
  ];

  return (
    <ScreenWrapper>
      <Header title={t('profile.title')} showBack />

      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={colors.primaryLight} />
        </View>
        <Text style={styles.name}>{user?.name || t('common.user')}</Text>
        <Text style={styles.email}>{user?.email || ''}</Text>
        {user?.createdAt && (
          <Text style={styles.memberSince}>
            {t('profile.memberSince', { date: new Date(user.createdAt).toLocaleDateString() })}
          </Text>
        )}
      </View>

      <View style={styles.statsRow}>
        <StatCard
          icon="book-outline"
          label={t('profile.entries')}
          value={stats?.totalEntries || 0}
          color={colors.primary}
        />
        <View style={{ width: spacing.md }} />
        <StatCard
          icon="flame-outline"
          label={t('profile.streak')}
          value={stats?.weeklyStreak || '0'}
          color={colors.status.warningDark}
        />
        <View style={{ width: spacing.md }} />
        <StatCard
          icon="happy-outline"
          label={t('profile.avgMood')}
          value={stats?.avgMood || '--'}
          color={colors.secondary}
        />
      </View>

      <Card style={styles.menuCard}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, index < menuItems.length - 1 && styles.menuItemBorder]}
            onPress={item.onPress}
            activeOpacity={0.6}
          >
            <View style={styles.menuLeft}>
              <Ionicons name={item.icon} size={22} color={colors.text.secondary} />
              <Text style={styles.menuLabel}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.text.tertiary} />
          </TouchableOpacity>
        ))}
      </Card>

      <Button
        title={t('profile.logOut')}
        variant="outline"
        onPress={handleLogout}
        style={styles.logoutButton}
        icon={<Ionicons name="log-out-outline" size={20} color={colors.primary} />}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  name: {
    ...typography.h3,
    color: colors.text.primary,
  },
  email: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xxs,
  },
  memberSince: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },
  menuCard: {
    marginBottom: spacing.xl,
    paddingVertical: spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuLabel: {
    ...typography.body,
    color: colors.text.primary,
  },
  logoutButton: {
    marginBottom: spacing.xl,
  },
});
