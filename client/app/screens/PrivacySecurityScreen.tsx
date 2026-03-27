import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  ScreenWrapper,
  Header,
  Card,
  Button,
  Input,
  AppModal,
  SectionHeader,
  LinkRow,
  SettingToggleRow,
} from '../components/ui';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { useTranslation } from '../i18n';
import { useAppDispatch } from '../store/hooks';
import { logoutUser } from '../store/slices/authSlice';

export default function PrivacySecurityScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert(t('common.error'), t('validation.passwordRequired'));
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert(t('common.error'), t('validation.passwordsMustMatch'));
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert(t('common.error'), t('validation.passwordMinLength'));
      return;
    }

    try {
      setChangingPassword(true);
      // TODO: call authAPI.changePassword({ currentPassword, newPassword }) when endpoint exists
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Alert.alert(t('common.save'), t('privacy.passwordChanged'));
      setPasswordModalVisible(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      Alert.alert(t('common.error'), t('privacy.passwordChangeFailed'));
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogoutAll = () => {
    Alert.alert(t('privacy.manageSessions'), t('privacy.logoutAllConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('privacy.logoutAllDevices'),
        style: 'destructive',
        onPress: () => {
          // TODO: call authAPI.logoutAllDevices() when endpoint exists
          dispatch(logoutUser());
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== 'DELETE') return;
    // TODO: call authAPI.deleteAccount() when endpoint exists
    Alert.alert(t('privacy.deleteAccount'), t('privacy.deleteAccountWarning'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          setDeleteModalVisible(false);
          dispatch(logoutUser());
        },
      },
    ]);
  };

  const handleExportData = () => {
    // TODO: call authAPI.exportData() when endpoint exists
    Alert.alert(t('privacy.exportData'), 'Coming soon');
  };

  const handleOpenLink = (type: 'terms' | 'privacyPolicy') => {
    // TODO: open actual URLs with Linking.openURL when available
    Alert.alert(type === 'terms' ? t('privacy.termsOfService') : t('privacy.privacyPolicy'), 'Coming soon');
  };

  return (
    <ScreenWrapper>
      <Header title={t('privacy.title')} showBack />

      <View style={styles.subtitleContainer}>
        <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
        <Text style={styles.subtitleText}>{t('privacy.subtitle')}</Text>
      </View>

     

      <SectionHeader title={t('privacy.dataPrivacy')} />
      <Card style={styles.card}>
        <View style={styles.infoBlock}>
          <View style={styles.infoHeader}>
            <Ionicons name="lock-closed" size={18} color={colors.primary} />
            <Text style={styles.infoTitle}>{t('privacy.dataPrivacyTitle')}</Text>
          </View>
          <Text style={styles.infoText}>{t('privacy.dataPrivacyDesc')}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoBlock}>
          <View style={styles.infoHeader}>
            <Ionicons name="eye-off" size={18} color={colors.accent} />
            <Text style={styles.infoTitle}>{t('privacy.anonymousTitle')}</Text>
          </View>
          <Text style={styles.infoText}>{t('privacy.anonymousDesc')}</Text>
        </View>
      </Card>

     

      {/* Change Password Modal */}
      <AppModal
        visible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
        title={t('privacy.changePassword')}
      >
        <Input
          label={t('privacy.currentPassword')}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          icon="lock-closed-outline"
          containerStyle={styles.modalInput}
        />
        <Input
          label={t('privacy.newPassword')}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          icon="key-outline"
          containerStyle={styles.modalInput}
        />
        <Input
          label={t('privacy.confirmNewPassword')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          icon="key-outline"
          containerStyle={styles.modalInput}
        />
        <Button
          title={t('privacy.updatePassword')}
          onPress={handleChangePassword}
          loading={changingPassword}
          size="md"
        />
      </AppModal>

      {/* Delete Account Modal */}
      <AppModal
        visible={deleteModalVisible}
        onClose={() => {
          setDeleteModalVisible(false);
          setDeleteConfirmText('');
        }}
        title={t('privacy.deleteAccount')}
      >
        <View style={styles.deleteWarning}>
          <Ionicons name="warning" size={28} color={colors.status.errorDark} />
          <Text style={styles.deleteWarningText}>{t('privacy.deleteAccountConfirm')}</Text>
        </View>
        <Text style={styles.deleteDescription}>{t('privacy.deleteAccountWarning')}</Text>
        <Input
          label={t('privacy.typeDelete')}
          value={deleteConfirmText}
          onChangeText={setDeleteConfirmText}
          icon="alert-circle-outline"
          containerStyle={styles.modalInput}
        />
        <Button
          title={t('privacy.deleteAccount')}
          variant="danger"
          onPress={handleDeleteAccount}
          disabled={deleteConfirmText !== 'DELETE'}
          size="md"
        />
      </AppModal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '0A',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  subtitleText: {
    ...typography.bodySm,
    color: colors.text.secondary,
    flex: 1,
  },
  card: {
    marginBottom: spacing.sm,
  },
  dangerCard: {
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.status.error + '30',
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.xs,
  },
  infoBlock: {
    paddingVertical: spacing.sm,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  infoTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  infoText: {
    ...typography.bodySm,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  modalInput: {
    marginBottom: spacing.md,
  },
  deleteWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  deleteWarningText: {
    ...typography.bodyMedium,
    color: colors.status.errorDark,
    flex: 1,
  },
  deleteDescription: {
    ...typography.bodySm,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
});
