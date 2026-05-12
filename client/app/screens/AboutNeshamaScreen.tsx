import React from 'react';
import { View, Text, StyleSheet, Image, Linking, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ScreenWrapper, Header, Card, SectionHeader, LinkRow } from '../components/ui';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { useTranslation } from '../i18n';
import type { RootStackParamList } from '../navigation/StackNavigator';

const APP_VERSION = '1.0.0';
const BUILD_NUMBER = '1';

type Props = NativeStackScreenProps<RootStackParamList, 'AboutNeshama'>;

interface FeatureItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  title: string;
  description: string;
}

function FeatureItem({ icon, iconColor, title, description }: FeatureItemProps) {
  return (
    <View style={featureStyles.row}>
      <View style={[featureStyles.iconWrap, { backgroundColor: iconColor + '15' }]}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <View style={featureStyles.content}>
        <Text style={featureStyles.title}>{title}</Text>
        <Text style={featureStyles.description}>{description}</Text>
      </View>
    </View>
  );
}

export default function AboutNeshamaScreen({ navigation }: Props) {
  const { t } = useTranslation();

  const handleOpenLink = (type: 'terms' | 'privacy' | 'licenses') => {
    const urls = {
      terms: 'https://neshamaapp.com/terms',
      privacy: 'https://neshamaapp.com/privacy',
      licenses: 'https://neshamaapp.com/licenses',
    };
    Linking.openURL(urls[type]).catch(() => {});
  };

  const handleContactEmail = () => {
    Linking.openURL(`mailto:${t('aboutApp.email')}`).catch(() => {});
  };

  return (
    <ScreenWrapper>
      <Header title={t('aboutApp.title')} showBack />

      <View style={styles.brandSection}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.appName}>{t('welcome.appName')}</Text>
        <Text style={styles.tagline}>{t('welcome.tagline')}</Text>
      </View>

      <SectionHeader title={t('aboutApp.mission')} />
      <Card style={styles.card}>
        <Text style={styles.missionText}>{t('aboutApp.missionText')}</Text>
      </Card>

      <SectionHeader title={t('aboutApp.whatWeOffer')} />
      <Card style={styles.card}>
          <FeatureItem
            icon="chatbubble-ellipses"
            iconColor={colors.gradients.primary[1]}
            title={t('aboutApp.featureChat')}
            description={t('aboutApp.featureChatDesc')}
          />

        <View style={styles.divider} />

          <FeatureItem
            icon="book"
            iconColor={colors.gradients.primary[1]}
            title={t('aboutApp.featureJournal')}
            description={t('aboutApp.featureJournalDesc')}
          />

        <View style={styles.divider} />

          <FeatureItem
            icon="leaf"
            iconColor={colors.gradients.primary[1]}
            title={t('aboutApp.featureCalm')}
            description={t('aboutApp.featureCalmDesc')}
          />

        <View style={styles.divider} />

        <TouchableOpacity
          onPress={() => navigation.navigate('MainTabs', { screen: 'Forum' })}
        >
          <FeatureItem
            icon="people"
            iconColor={colors.gradients.primary[1]}
            title={t('aboutApp.featureCommunity')}
            description={t('aboutApp.featureCommunityDesc')}
          />
        </TouchableOpacity>
      </Card>

      <SectionHeader title={t('aboutApp.version')} />
      <Card style={styles.card}>
        <View style={styles.versionRow}>
          <Text style={styles.versionLabel}>{t('aboutApp.version')}</Text>
          <Text style={styles.versionValue}>{APP_VERSION}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.versionRow}>
          <Text style={styles.versionLabel}>{t('aboutApp.buildNumber')}</Text>
          <Text style={styles.versionValue}>{BUILD_NUMBER}</Text>
        </View>
      </Card>

      <SectionHeader title={t('aboutApp.team')} />
      <Card style={styles.card}>
        <View style={styles.teamRow}>
          <View style={styles.teamIconWrap}>
            <Ionicons name="heart" size={22} color={colors.status.error} />
          </View>
          <Text style={styles.teamText}>{t('aboutApp.teamDesc')}</Text>
        </View>
      </Card>

      <SectionHeader title={t('aboutApp.contact')} />
      <Card style={styles.card}>
        <Text style={styles.contactDesc}>{t('aboutApp.contactDesc')}</Text>
        <LinkRow
          icon="mail-outline"
          iconColor={colors.primary}
          label={t('aboutApp.email')}
          onPress={handleContactEmail}
        />
      </Card>

      <View style={styles.footer}>
        <Ionicons name="heart" size={14} color={colors.status.error} />
        <Text style={styles.footerText}>{t('aboutApp.madeWith')}</Text>
      </View>
    </ScreenWrapper>
  );
}

const featureStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  description: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: 2,
  },
});

const styles = StyleSheet.create({
  brandSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  logo: {
    width: 60,
    height: 60,
  },
  appName: {
    ...typography.h2,
    color: colors.text.primary,
  },
  tagline: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  card: {
    marginBottom: spacing.sm,
  },
  missionText: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm,
  },
  versionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  versionLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },
  versionValue: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamIconWrap: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.status.error + '12',
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: spacing.md,
  },
  teamText: {
    ...typography.bodySm,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 22,
  },
  contactDesc: {
    ...typography.bodySm,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    gap: spacing.xs,
  },
  footerText: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
});
