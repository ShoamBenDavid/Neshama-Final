import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper, Header, Card, SectionHeader, SettingToggleRow } from '../components/ui';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { useTranslation } from '../i18n';

const STORAGE_KEY = '@neshama_notification_prefs';
const SAVE_DEBOUNCE_MS = 600;

export interface NotificationPrefs {
  dailyMood: boolean;
  journal: boolean;
  breathing: boolean;
  community: boolean;
  supportCenter: boolean;
  general: boolean;
  quietHours: boolean;
}

const DEFAULT_PREFS: NotificationPrefs = {
  dailyMood: true,
  journal: true,
  breathing: false,
  community: true,
  supportCenter: true,
  general: true,
  quietHours: false,
};

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export default function NotificationOptionsScreen() {
  const { t } = useTranslation();
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestPrefs = useRef<NotificationPrefs>(DEFAULT_PREFS);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled && raw) {
          const parsed = JSON.parse(raw) as Partial<NotificationPrefs>;
          const merged = { ...DEFAULT_PREFS, ...parsed };
          setPrefs(merged);
          latestPrefs.current = merged;
        }
      } catch {
        // Storage read failed — keep defaults silently
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persistPrefs = useCallback((next: NotificationPrefs) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);

    setSaveStatus('saving');
    saveTimer.current = setTimeout(async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        // TODO: sync with backend when user notification preferences endpoint is available
        // e.g. await userAPI.updateNotificationPrefs(next);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 1800);
      } catch {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 2500);
      }
    }, SAVE_DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const toggle = useCallback(
    (key: keyof NotificationPrefs) => (value: boolean) => {
      const next = { ...latestPrefs.current, [key]: value };
      latestPrefs.current = next;
      setPrefs(next);
      persistPrefs(next);
    },
    [persistPrefs],
  );

  const anyEnabled = Object.entries(prefs)
    .filter(([k]) => k !== 'quietHours')
    .some(([, v]) => v);

  if (isLoading) {
    return (
      <ScreenWrapper>
        <Header title={t('notifications.title')} showBack />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Header
        title={t('notifications.title')}
        showBack
        rightAction={<SaveIndicator status={saveStatus} />}
      />


      {/* Reminders */}
      <SectionHeader title={t('notifications.reminders')} />
      <Card style={styles.card}>
        <SettingToggleRow
          icon="happy-outline"
          iconColor={colors.mood[4]}
          label={t('notifications.dailyMood')}
          description={t('notifications.dailyMoodDesc')}
          value={prefs.dailyMood}
          onToggle={toggle('dailyMood')}
        />
        <View style={styles.divider} />
        <SettingToggleRow
          icon="book-outline"
          iconColor={colors.primary}
          label={t('notifications.journal')}
          description={t('notifications.journalDesc')}
          value={prefs.journal}
          onToggle={toggle('journal')}
        />
        <View style={styles.divider} />
        <SettingToggleRow
          icon="leaf-outline"
          iconColor={colors.secondary}
          label={t('notifications.breathing')}
          description={t('notifications.breathingDesc')}
          value={prefs.breathing}
          onToggle={toggle('breathing')}
        />
      </Card>

      {/* Community */}
      <SectionHeader title={t('notifications.community')} />
      <Card style={styles.card}>
        <SettingToggleRow
          icon="people-outline"
          iconColor={colors.accent}
          label={t('notifications.communityUpdates')}
          description={t('notifications.communityDesc')}
          value={prefs.community}
          onToggle={toggle('community')}
        />
        <View style={styles.divider} />
        <SettingToggleRow
          icon="heart-outline"
          iconColor={colors.status.error}
          label={t('notifications.supportCenter')}
          description={t('notifications.supportCenterDesc')}
          value={prefs.supportCenter}
          onToggle={toggle('supportCenter')}
        />
      </Card>

      {/* App Updates */}
      <SectionHeader title={t('notifications.appUpdates')} />
      <Card style={styles.card}>
        <SettingToggleRow
          icon="megaphone-outline"
          iconColor={colors.status.infoDark}
          label={t('notifications.general')}
          description={t('notifications.generalDesc')}
          value={prefs.general}
          onToggle={toggle('general')}
        />
        <View style={styles.divider} />
        <SettingToggleRow
          icon="moon-outline"
          iconColor={colors.accentDark}
          label={t('notifications.quietHours')}
          description={t('notifications.quietHoursDesc')}
          value={prefs.quietHours}
          onToggle={toggle('quietHours')}
        />
      </Card>
    </ScreenWrapper>
  );
}

function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === 'idle') return null;

  const icon: keyof typeof Ionicons.glyphMap =
    status === 'saving'
      ? 'cloud-upload-outline'
      : status === 'saved'
        ? 'checkmark-circle'
        : 'alert-circle-outline';

  const color =
    status === 'saving'
      ? colors.text.tertiary
      : status === 'saved'
        ? colors.status.successDark
        : colors.status.errorDark;

  return (
    <View style={indicatorStyles.wrap}>
      {status === 'saving' ? (
        <ActivityIndicator size={16} color={colors.text.tertiary} />
      ) : (
        <Ionicons name={icon} size={18} color={color} />
      )}
    </View>
  );
}

const indicatorStyles = StyleSheet.create({
  wrap: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing['5xl'],
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '0A',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginEnd: spacing.sm,
  },
  dotActive: {
    backgroundColor: colors.status.successDark,
  },
  dotInactive: {
    backgroundColor: colors.text.tertiary,
  },
  statusText: {
    ...typography.bodySm,
    color: colors.text.secondary,
  },
  card: {
    marginBottom: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.xs,
  },
});
