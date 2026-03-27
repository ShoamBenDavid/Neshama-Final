import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper, Header } from '../components/ui';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { getMeditationSessions } from '../content/localizedContent';
import type { MeditationSession } from '../content/types';
import type { RootStackParamList } from '../navigation/StackNavigator';
import { useTranslation } from '../i18n';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function MeditationCard({ session }: { session: MeditationSession }) {
  const navigation = useNavigation<Nav>();
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('MeditationSession', { sessionId: session.id })}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={session.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.iconCircle}>
          <Ionicons name={session.icon as any} size={28} color="rgba(255,255,255,0.95)" />
        </View>
        <Text style={styles.title}>{session.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{session.description}</Text>
        <View style={styles.meta}>
          <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.75)" />
          <Text style={styles.metaText}>{session.duration} {t('common.min')}</Text>
          <View style={styles.dot} />
          <Text style={styles.metaText}>{session.category}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default function MeditationLibraryScreen() {
  const { t, language } = useTranslation();
  const sessions = getMeditationSessions(language);

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <Header title={t('meditation.title')} showBack subtitle={t('meditation.subtitle')} />

      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MeditationCard session={item} />}
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
    minHeight: 160,
    justifyContent: 'flex-end',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: '#fff',
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.bodySm,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  metaText: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.75)',
    textTransform: 'capitalize',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: spacing.xs,
  },
});
