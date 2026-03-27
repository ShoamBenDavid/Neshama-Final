import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper, LoadingState, ErrorState, EmptyState } from '../components/ui';
import ForumPostCard from '../components/ForumPostCard';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchForumPosts, togglePostLike } from '../store/slices/forumSlice';
import { useTranslation } from '../i18n';
import type { RootStackParamList } from '../navigation/StackNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ForumScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { posts, isLoading, error } = useAppSelector((state) => state.forum);
  const [activeCategory, setActiveCategory] = useState('all');
  const { t } = useTranslation();

  const CATEGORIES = useMemo(() => [
    { id: 'all', label: t('forum.categoryAll') },
    { id: 'anxiety', label: t('forum.categoryAnxiety') },
    { id: 'depression', label: t('forum.categoryDepression') },
    { id: 'relationships', label: t('forum.categoryRelationships') },
    { id: 'work-stress', label: t('forum.categoryWorkStress') },
    { id: 'success', label: t('forum.categorySuccess') },
    { id: 'general', label: t('forum.categoryGeneral') },
  ], [t]);

  const loadPosts = useCallback(() => {
    const params = activeCategory === 'all' ? {} : { category: activeCategory };
    dispatch(fetchForumPosts(params));
  }, [dispatch, activeCategory]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  if (isLoading && posts.length === 0) {
    return <LoadingState message={t('forum.loadingCommunity')} />;
  }

  if (error && posts.length === 0) {
    return <ErrorState message={error} onRetry={loadPosts} />;
  }

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('forum.community')}</Text>
        <Text style={styles.subtitle}>{t('forum.communitySubtitle')}</Text>
      </View>

      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.chip,
              activeCategory === item.id && styles.chipActive,
            ]}
            onPress={() => setActiveCategory(item.id)}
          >
            <Text
              style={[
                styles.chipText,
                activeCategory === item.id && styles.chipTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.chipsList}
        showsHorizontalScrollIndicator={false}
        style={styles.chipsContainer}
      />

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ForumPostCard
            post={item}
            onPress={() => navigation.navigate('ForumPost', { postId: item.id })}
            onLike={() => dispatch(togglePostLike(item.id))}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="people-outline"
            title={t('forum.noPosts')}
            message={t('forum.noPostsSubtitle')}
            actionLabel={t('forum.createPost')}
            onAction={() => navigation.navigate('CreateForumPost')}
          />
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateForumPost')}
        activeOpacity={0.8}
      >
        <Ionicons name="create-outline" size={24} color={colors.text.inverse} />
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xxs,
  },
  chipsContainer: {
    maxHeight: 48,
    marginTop: spacing.md,
  },
  chipsList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.captionMedium,
    color: colors.text.secondary,
  },
  chipTextActive: {
    color: colors.text.inverse,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing['5xl'],
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
});
