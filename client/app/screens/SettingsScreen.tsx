import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper, Header, Card, Button, Input } from '../components/ui';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setUser } from '../store/slices/authSlice';
import { authAPI } from '../services/api';
import { useTranslation } from '../i18n';
import type { Language } from '../i18n';

export default function SettingsScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { t, language, setLanguage } = useTranslation();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  const [notifications, setNotifications] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert(t('common.error'), t('settings.nameRequired'));
      return;
    }

    try {
      setSaving(true);
      const response = await authAPI.updateProfile({
        name: name.trim(),
        phone: phone.trim() || undefined,
      });
      if (response.success && response.data) {
        dispatch(setUser(response.data.user));
        Alert.alert(t('common.save'), t('settings.profileUpdated'));
      }
    } catch (err: any) {
      Alert.alert(t('common.error'), err.message || t('settings.profileUpdateFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <ScreenWrapper>
      <Header title={t('settings.title')} showBack />

      <Text style={styles.sectionTitle}>{t('settings.profile')}</Text>
      <Card style={styles.card}>
        <Input
          label={t('settings.name')}
          value={name}
          onChangeText={setName}
          icon="person-outline"
          containerStyle={styles.input}
        />
        <Input
          label={t('settings.phoneOptional')}
          value={phone}
          onChangeText={setPhone}
          icon="call-outline"
          keyboardType="phone-pad"
          containerStyle={styles.input}
        />
        <Button
          title={t('settings.saveChanges')}
          onPress={handleSaveProfile}
          loading={saving}
          size="md"
        />
      </Card>

      <Text style={styles.sectionTitle}>{t('settings.preferences')}</Text>
      <Card style={styles.card}>
        <SettingRow
          label={t('settings.pushNotifications')}
          description={t('settings.pushNotificationsDesc')}
          value={notifications}
          onToggle={setNotifications}
        />
        <View style={styles.divider} />
        <SettingRow
          label={t('settings.dailyReminder')}
          description={t('settings.dailyReminderDesc')}
          value={dailyReminder}
          onToggle={setDailyReminder}
        />
        <View style={styles.divider} />
        <SettingRow
          label={t('settings.darkMode')}
          description={t('settings.darkModeDesc')}
          value={darkMode}
          onToggle={setDarkMode}
          disabled
        />
      </Card>

      <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
      <Card style={styles.card}>
        <LanguageOption
          label={t('settings.english')}
          selected={language === 'en'}
          onPress={() => handleLanguageChange('en')}
        />
        <View style={styles.divider} />
        <LanguageOption
          label={t('settings.hebrew')}
          selected={language === 'he'}
          onPress={() => handleLanguageChange('he')}
        />
      </Card>

      <Text style={styles.sectionTitle}>{t('settings.about')}</Text>
      <Card style={styles.card}>
        <View style={styles.aboutRow}>
          <Text style={styles.aboutLabel}>{t('settings.version')}</Text>
          <Text style={styles.aboutValue}>1.0.0</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.aboutRow}>
          <Text style={styles.aboutLabel}>{t('settings.build')}</Text>
          <Text style={styles.aboutValue}>{t('settings.production')}</Text>
        </View>
      </Card>
    </ScreenWrapper>
  );
}

function LanguageOption({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={langStyles.row} onPress={onPress} activeOpacity={0.7}>
      <Text style={[langStyles.label, selected && langStyles.labelSelected]}>{label}</Text>
      {selected && (
        <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
      )}
    </TouchableOpacity>
  );
}

function SettingRow({
  label,
  description,
  value,
  onToggle,
  disabled = false,
}: {
  label: string;
  description: string;
  value: boolean;
  onToggle: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <View style={settingStyles.row}>
      <View style={settingStyles.info}>
        <Text style={settingStyles.label}>{label}</Text>
        <Text style={settingStyles.description}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{ false: colors.border, true: colors.primaryLight }}
        thumbColor={value ? colors.primary : colors.text.tertiary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  card: {
    marginBottom: spacing.sm,
  },
  input: {
    marginBottom: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.md,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  aboutLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },
  aboutValue: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
});

const langStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  label: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  labelSelected: {
    color: colors.primary,
  },
});

const settingStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
    marginEnd: spacing.md,
  },
  label: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  description: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: 2,
  },
});
