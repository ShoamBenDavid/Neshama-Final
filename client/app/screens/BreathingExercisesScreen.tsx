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
import { getBreathingExercises } from '../content/localizedContent';
import type { BreathingExercise } from '../content/types';
import type { RootStackParamList } from '../navigation/StackNavigator';
import { useTranslation } from '../i18n';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function ExerciseCard({ exercise }: { exercise: BreathingExercise }) {
  const navigation = useNavigation<Nav>();
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('BreathingSession', { exerciseId: exercise.id })}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={exercise.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconCircle}>
            <Ionicons name={exercise.icon as any} size={24} color="rgba(255,255,255,0.95)" />
          </View>
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>{exercise.difficulty}</Text>
          </View>
        </View>

        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <Text style={styles.exerciseDesc} numberOfLines={2}>{exercise.description}</Text>

        <View style={styles.cardFooter}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.metaText}>{Math.floor(exercise.duration / 60)} {t('common.min')}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="repeat-outline" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.metaText}>{t('common.rounds', { count: exercise.rounds })}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default function BreathingExercisesScreen() {
  const { t, language } = useTranslation();
  const exercises = getBreathingExercises(language);

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <Header title={t('breathing.title')} showBack subtitle={t('breathing.subtitle')} />

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ExerciseCard exercise={item} />}
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  difficultyBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  difficultyText: {
    ...typography.caption,
    color: '#fff',
    textTransform: 'capitalize',
  },
  exerciseName: {
    ...typography.h3,
    color: '#fff',
    marginBottom: spacing.xs,
  },
  exerciseDesc: {
    ...typography.bodySm,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
  },
});
