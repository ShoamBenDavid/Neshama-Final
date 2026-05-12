import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenWrapper, Card } from '../components/ui';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import type { RootStackParamList } from '../navigation/StackNavigator';
import { useTranslation, getChevronForwardName } from '../i18n';
import { getSupportServices, CrisisResource } from '../content/supportServices';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function SupportCenterScreen() {
  const navigation = useNavigation<Nav>();
  const { t, language, isRTL } = useTranslation();

  const services = useMemo(() => getSupportServices(language), [language]);

  const SUPPORT_OPTIONS = useMemo(
    () => [
      {
        title: t('support.talkToAI'),
        description: t('support.talkToAIDesc'),
        icon: 'chatbubble-ellipses-outline' as const,
        color: colors.primary,
        action: 'chat',
      },
      {
        title: t('support.browseResources'),
        description: t('support.browseResourcesDesc'),
        icon: 'library-outline' as const,
        color: colors.primary,
        action: 'content',
      },
      {
        title: t('support.communitySupport'),
        description: t('support.communitySupportDesc'),
        icon: 'people-outline' as const,
        color: colors.primary,
        action: 'forum',
      },
      {
        title: t('support.writeInJournal'),
        description: t('support.writeInJournalDesc'),
        icon: 'book-outline' as const,
        color: colors.primary,
        action: 'journal',
      },
    ],
    [t],
  );

  const handleAction = (action: string) => {
    switch (action) {
      case 'chat':
        navigation.navigate('Chat');
        break;
      case 'content':
        navigation.navigate('ContentLibrary');
        break;
      case 'forum':
        navigation.navigate('MainTabs', { screen: 'Forum' });
        break;
      case 'journal':
        navigation.navigate('CreateJournal', {});
        break;
    }
  };

  const handleCrisisPress = (resource: CrisisResource) => {
    if (resource.callable) {
      const cleaned = resource.number.replace(/[^0-9*#]/g, '');
      Linking.openURL(`tel:${cleaned}`);
    }
  };

  const chevronForward = getChevronForwardName(isRTL);

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.title}>{t('support.title')}</Text>
        <Text style={styles.subtitle}>{t('support.subtitle')}</Text>
      </View>

      <LinearGradient
        colors={['#FF7675', '#D63031']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.emergencyCard}
      >
        <Ionicons name="shield-checkmark-outline" size={28} color="#fff" />
        <View style={styles.emergencyContent}>
          <Text style={styles.emergencyTitle}>{t('support.inCrisis')}</Text>
          <Text style={styles.emergencyText}>
            {t('support.crisisMessage')}
          </Text>
        </View>
      </LinearGradient>

      <Text style={styles.sectionTitle}>{t('support.crisisResources')}</Text>
      {services.crisisResources.map((resource, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleCrisisPress(resource)}
          activeOpacity={resource.callable ? 0.7 : 1}
        >
          <Card style={styles.crisisCard}>
            <View style={styles.crisisIcon}>
              <Ionicons name={resource.icon} size={22} color={colors.status.errorDark} />
            </View>
            <View style={styles.crisisInfo}>
              <Text style={styles.crisisName}>{resource.name}</Text>
              <Text style={styles.crisisNumber}>{resource.number}</Text>
              <Text style={styles.crisisDesc}>{resource.description}</Text>
            </View>
          </Card>
        </TouchableOpacity>
      ))}

      <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>
        {t('support.howCanWeHelp')}
      </Text>
      {SUPPORT_OPTIONS.map((option, index) => (
        <Card
          key={index}
          style={styles.optionCard}
          onPress={() => handleAction(option.action)}
        >
          <View style={[styles.optionIcon, { backgroundColor: option.color + '15' }]}>
            <Ionicons name={option.icon} size={24} color={option.color} />
          </View>
          <View style={styles.optionInfo}>
            <Text style={styles.optionTitle}>{option.title}</Text>
            <Text style={styles.optionDesc}>{option.description}</Text>
          </View>
          <Ionicons name={chevronForward} size={20} color={colors.text.tertiary} />
        </Card>
      ))}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing.md,
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xl,
    gap: spacing.md,
    ...shadows.md,
  },
  emergencyContent: {
    flex: 1,
  },
  emergencyTitle: {
    ...typography.h4,
    color: '#FFFFFF',
  },
  emergencyText: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  crisisCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  crisisIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.status.error + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crisisInfo: {
    flex: 1,
  },
  crisisName: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  crisisNumber: {
    ...typography.h4,
    color: colors.status.errorDark,
    marginTop: 2,
  },
  crisisDesc: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  optionDesc: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
});
