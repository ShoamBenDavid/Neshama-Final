import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ScreenWrapper, Header, Button, Input } from '../components/ui';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, clearError } from '../store/slices/authSlice';
import { useTranslation } from '../i18n';
import type { RootStackParamList } from '../navigation/StackNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const { t } = useTranslation();

  const LoginSchema = useMemo(() => Yup.object().shape({
    email: Yup.string().email(t('validation.emailInvalid')).required(t('validation.emailRequired')),
    password: Yup.string().min(6, t('validation.passwordMinLength')).required(t('validation.passwordRequired')),
  }), [t]);

  React.useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleLogin = async (values: { email: string; password: string }) => {
    const result = await dispatch(loginUser(values));
    if (loginUser.rejected.match(result)) {
      Alert.alert(t('auth.loginFailed'), result.payload as string);
    }
  };

  return (
    <ScreenWrapper>
      <Header title={t('auth.welcomeBack')} showBack />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <View style={styles.content}>
          <Text style={styles.subtitle}>
            {t('auth.signInSubtitle')}
          </Text>

          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.form}>
                <Input
                  label={t('auth.email')}
                  icon="mail-outline"
                  placeholder={t('auth.enterYourEmail')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  error={touched.email && errors.email ? errors.email : undefined}
                />

                <Input
                  label={t('auth.password')}
                  icon="lock-closed-outline"
                  placeholder={t('auth.enterYourPassword')}
                  isPassword
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  error={touched.password && errors.password ? errors.password : undefined}
                />

                <Button
                  title={t('auth.signIn')}
                  onPress={() => handleSubmit()}
                  loading={isLoading}
                  size="lg"
                  style={styles.submitButton}
                />
              </View>
            )}
          </Formik>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('auth.dontHaveAccount')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.footerLink}>{t('auth.signUp')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    flex: 1,
    paddingTop: spacing.xl,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
  },
  errorBanner: {
    backgroundColor: colors.status.error + '12',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.base,
  },
  errorText: {
    ...typography.bodySm,
    color: colors.status.errorDark,
    textAlign: 'center',
  },
  form: {
    gap: spacing.xs,
  },
  submitButton: {
    marginTop: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing['2xl'],
  },
  footerText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  footerLink: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
});
