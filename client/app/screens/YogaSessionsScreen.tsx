import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper, Header } from '../components/ui';
import { typography } from '../theme/typography';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { getYogaSessions } from '../content/localizedContent';
import type { RootStackParamList } from '../navigation/StackNavigator';
import { useTranslation } from '../i18n';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function YogaSessionsScreen() {
  const navigation = useNavigation<Nav>();
  const { t, language } = useTranslation();
  const sessions = getYogaSessions(language);
  const getDifficultyLabel = (difficulty: 'beginner' | 'intermediate' | 'advanced') => {
    if (difficulty === 'intermediate') return t('yoga.difficultyIntermediate');
    if (difficulty === 'advanced') return t('yoga.difficultyAdvanced');
    return t('yoga.difficultyBeginner');
  };

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <Header title={t('yoga.title')} showBack subtitle={t('yoga.subtitle')} />

      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('YogaDetail', { sessionId: item.id })}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={item.gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
              <View style={styles.cardTop}>
                <Ionicons name={item.icon as any} size={28} color="rgba(255,255,255,0.9)" />
                <View style={styles.badges}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{getDifficultyLabel(item.difficulty)}</Text>
                  </View>
                  {item.youtubeId && (
                    <View style={styles.badge}>
                      <Ionicons name="play-circle" size={12} color="#fff" />
                      <Text style={styles.badgeText}>{t('common.video')}</Text>
                    </View>
                  )}
                </View>
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
              <View style={styles.footer}>
                <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.75)" />
                <Text style={styles.footerText}>{item.duration} {t('common.min')}</Text>
                <View style={styles.dot} />
                <Text style={styles.footerText}>{t('common.poses', { count: item.poses.length })}</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  card: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.base,
    ...shadows.md,
  },
  gradient: {
    padding: spacing.lg,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    ...typography.caption,
    color: '#fff',
    textTransform: 'capitalize',
  },
  title: {
    ...typography.h3,
    color: '#fff',
    marginBottom: spacing.xs,
  },
  desc: {
    ...typography.bodySm,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  footerText: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.75)',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: spacing.xxs,
  },
});
