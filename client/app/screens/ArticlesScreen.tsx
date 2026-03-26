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
import { wellnessArticles } from '../content';
import type { RootStackParamList } from '../navigation/StackNavigator';
import { useTranslation } from '../i18n';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ArticlesScreen() {
  const navigation = useNavigation<Nav>();
  const { t } = useTranslation();

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <Header title={t('articles.title')} showBack subtitle={t('articles.subtitle')} />

      <FlatList
        data={wellnessArticles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ArticleDetail', { articleId: item.id })}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={item.gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.accentStripe}
            />
            <View style={styles.cardContent}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
              <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.summary} numberOfLines={2}>{item.summary}</Text>
              <View style={styles.meta}>
                <Ionicons name="time-outline" size={13} color={colors.text.tertiary} />
                <Text style={styles.metaText}>{t('common.minRead', { time: item.readTime })}</Text>
                <View style={styles.dot} />
                <Text style={styles.metaText}>{item.author}</Text>
              </View>
            </View>
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
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  accentStripe: {
    width: 6,
  },
  cardContent: {
    flex: 1,
    padding: spacing.base,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight + '18',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs,
    marginBottom: spacing.sm,
  },
  categoryText: {
    ...typography.caption,
    color: colors.primary,
    textTransform: 'capitalize',
  },
  title: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  summary: {
    ...typography.bodySm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  metaText: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.text.tertiary,
    marginHorizontal: 2,
  },
});
