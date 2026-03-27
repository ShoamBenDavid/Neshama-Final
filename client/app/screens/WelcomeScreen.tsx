import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/ui';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { useTranslation } from '../i18n';
import type { RootStackParamList } from '../navigation/StackNavigator';

const { height } = Dimensions.get('window');

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function WelcomeScreen() {
  const navigation = useNavigation<Nav>();
  const { t } = useTranslation();

  const features: { icon: keyof typeof Ionicons.glyphMap; key: string }[] = [
    { icon: 'journal-outline', key: 'welcome.featureJournal' },
    { icon: 'chatbubble-ellipses-outline', key: 'welcome.featureAI' },
    { icon: 'people-outline', key: 'welcome.featureCommunity' },
  ];

  return (
    <LinearGradient
      colors={['#F0EDE8', '#E8E0D5', '#FBF8F3']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="leaf" size={48} color={colors.primary} />
          </View>
          <Text style={styles.appName}>{t('welcome.appName')}</Text>
          <Text style={styles.tagline}>{t('welcome.tagline')}</Text>
        </View>

        <View style={styles.illustrationArea}>
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />
          <View style={styles.decorCircle3} />
          <View style={styles.centralIcon}>
            <Ionicons name="heart-outline" size={64} color={colors.primaryLight} />
          </View>
        </View>

        <View style={styles.features}>
          {features.map((feature, i) => (
            <View key={i} style={styles.featureRow}>
              <Ionicons name={feature.icon} size={20} color={colors.primary} />
              <Text style={styles.featureText}>{t(feature.key)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.buttons}>
          <Button
            title={t('auth.getStarted')}
            onPress={() => navigation.navigate('Register')}
            size="lg"
          />
          <Button
            title={t('auth.iAlreadyHaveAccount')}
            variant="ghost"
            onPress={() => navigation.navigate('Login')}
            size="md"
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
    paddingTop: height * 0.08,
    paddingBottom: spacing['3xl'],
  },
  logoSection: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.base,
  },
  appName: {
    ...typography.h1,
    color: colors.text.primary,
    letterSpacing: 1,
  },
  tagline: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  illustrationArea: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  decorCircle1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primaryLight + '15',
  },
  decorCircle2: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.secondaryLight + '10',
    left: -20,
  },
  decorCircle3: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accentLight + '15',
    right: 20,
    top: 10,
  },
  centralIcon: {
    zIndex: 1,
  },
  features: {
    gap: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  buttons: {
    gap: spacing.sm,
  },
});
