import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper, Card } from '../components/ui';
import ResourceCard from '../components/ResourceCard';
import MoodSelector from '../components/MoodSelector';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchRecommendedContent } from '../store/slices/contentSlice';
import { useTranslation } from '../i18n';
import type { RootStackParamList } from '../navigation/StackNavigator';

const { width } = Dimensions.get('window');
type Nav = NativeStackNavigationProp<RootStackParamList>;

const WELLNESS_CATEGORIES = [
  { icon: 'flower-outline' as const, labelKey: 'home.meditate' as const, color: '#667EEA', screen: 'MeditationLibrary' as const },
  { icon: 'leaf-outline' as const, labelKey: 'home.breathe' as const, color: '#43E97B', screen: 'BreathingExercises' as const },
  { icon: 'body-outline' as const, labelKey: 'home.yoga' as const, color: '#FA709A', screen: 'YogaSessions' as const },
  { icon: 'document-text-outline' as const, labelKey: 'home.read' as const, color: '#A18CD1', screen: 'Articles' as const },
  { icon: 'headset-outline' as const, labelKey: 'home.listen' as const, color: '#74B9FF', screen: 'AudioRelaxation' as const },
  { icon: 'chatbubble-ellipses-outline' as const, labelKey: 'home.aiChat' as const, color: '#9B8EC4', screen: 'Chat' as const },
];

export default function HomePageScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { recommended } = useAppSelector((state) => state.content);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchRecommendedContent());
  }, [dispatch]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('home.goodMorning');
    if (hour < 17) return t('home.goodAfternoon');
    return t('home.goodEvening');
  };

  const firstName = user?.name?.split(' ')[0] || t('home.there');

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.userName}>{firstName}</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-circle-outline" size={36} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <Card style={styles.moodCheckIn}>
        <Text style={styles.sectionLabel}>{t('home.howAreYouFeeling')}</Text>
        <MoodSelector
          selected={null}
          onSelect={(mood) => navigation.navigate('CreateJournal', { initialMood: mood })}
          compact
        />
      </Card>

      <Text style={styles.sectionTitle}>{t('home.exploreWellness')}</Text>
      <View style={styles.categoriesGrid}>
        {WELLNESS_CATEGORIES.map((cat, i) => (
          <TouchableOpacity
            key={i}
            style={styles.categoryCard}
            onPress={() => navigation.navigate(cat.screen)}
            activeOpacity={0.7}
          >
            <View style={[styles.categoryIcon, { backgroundColor: cat.color + '15' }]}>
              <Ionicons name={cat.icon} size={26} color={cat.color} />
            </View>
            <Text style={styles.categoryLabel}>{t(cat.labelKey)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.aiCard}
        onPress={() => navigation.navigate('Chat')}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={colors.gradients.primary as unknown as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.aiGradient}
        >
          <Ionicons name="sparkles-outline" size={24} color="#fff" />
          <View style={styles.aiText}>
            <Text style={styles.aiTitle}>{t('home.talkToNeshamaAI')}</Text>
            <Text style={styles.aiSubtitle}>{t('home.aiCompanionDescription')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.quickRow}>
        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => navigation.navigate('BreathingExercises')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#43E97B', '#38F9D7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.quickGradient}
          >
            <Ionicons name="leaf-outline" size={22} color="#fff" />
            <Text style={styles.quickTitle}>{t('home.quickCalm')}</Text>
            <Text style={styles.quickSub}>{t('home.twoMinBreathing')}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => navigation.navigate('MeditationLibrary')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#667EEA', '#764BA2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.quickGradient}
          >
            <Ionicons name="flower-outline" size={22} color="#fff" />
            <Text style={styles.quickTitle}>{t('home.meditate')}</Text>
            <Text style={styles.quickSub}>{t('home.fiveMinSession')}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {recommended.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.recommended')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ContentLibrary')}>
              <Text style={styles.seeAll}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recommended.slice(0, 4).map((item) => (
              <View key={item.id} style={styles.recommendedCard}>
                <ResourceCard item={item} onPress={() => {}} />
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    marginBottom: spacing.xl,
  },
  greeting: {
    ...typography.body,
    color: colors.text.secondary,
  },
  userName: {
    ...typography.h2,
    color: colors.text.primary,
  },
  profileButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodCheckIn: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  categoryCard: {
    width: (width - spacing.lg * 2 - spacing.md * 2) / 3,
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  categoryLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  aiCard: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  aiGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  aiText: {
    flex: 1,
  },
  aiTitle: {
    ...typography.bodyMedium,
    color: '#FFFFFF',
  },
  aiSubtitle: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  quickRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  quickCard: {
    flex: 1,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  quickGradient: {
    padding: spacing.base,
    minHeight: 100,
    justifyContent: 'space-between',
  },
  quickTitle: {
    ...typography.bodyMedium,
    color: '#fff',
    marginTop: spacing.sm,
  },
  quickSub: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.75)',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  seeAll: {
    ...typography.captionMedium,
    color: colors.primary,
  },
  recommendedCard: {
    width: width * 0.6,
    marginRight: spacing.md,
  },
});
