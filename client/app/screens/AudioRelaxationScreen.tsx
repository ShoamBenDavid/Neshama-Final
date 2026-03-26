import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper, Header, AppModal } from '../components/ui';
import { AudioPlayer } from '../components/players';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { getAudioTracks } from '../content/localizedContent';
import type { AudioTrack } from '../content/types';
import { useTranslation } from '../i18n';

export default function AudioRelaxationScreen() {
  const { t, language } = useTranslation();
  const [selectedTrack, setSelectedTrack] = useState<AudioTrack | null>(null);
  const tracks = getAudioTracks(language);

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <Header title={t('audio.title')} showBack subtitle={t('audio.subtitle')} />

      <FlatList
        data={tracks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => setSelectedTrack(item)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={item.gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientIcon}
            >
              <Ionicons name={item.icon as any} size={28} color="rgba(255,255,255,0.95)" />
            </LinearGradient>
            <View style={styles.cardInfo}>
              <Text style={styles.trackTitle}>{item.title}</Text>
              <Text style={styles.trackDesc} numberOfLines={1}>{item.description}</Text>
              <View style={styles.trackMeta}>
                <Ionicons name="time-outline" size={12} color={colors.text.tertiary} />
                <Text style={styles.metaText}>
                  {Math.floor(item.duration / 60)} {t('common.min')}
                </Text>
                <View style={styles.dot} />
                <Text style={styles.metaText}>{item.category}</Text>
              </View>
            </View>
            <Ionicons name="play-circle" size={36} color={colors.primary} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <AppModal
        visible={!!selectedTrack}
        onClose={() => setSelectedTrack(null)}
        title={selectedTrack?.title}
      >
        {selectedTrack && (
          <AudioPlayer
            track={selectedTrack}
            color={selectedTrack.gradientColors[0]}
          />
        )}
      </AppModal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    marginBottom: spacing.md,
    gap: spacing.md,
    ...shadows.sm,
  },
  gradientIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  trackTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  trackDesc: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  trackMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  metaText: {
    ...typography.caption,
    color: colors.text.tertiary,
    textTransform: 'capitalize',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.text.tertiary,
  },
});
