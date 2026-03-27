import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from './ui/Card';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { ForumPost } from '../services/api';
import { useTranslation } from '../i18n';

interface ForumPostCardProps {
  post: ForumPost;
  onPress?: () => void;
  onLike?: () => void;
}

export default function ForumPostCard({ post, onPress, onLike }: ForumPostCardProps) {
  const { t } = useTranslation();
  const categoryColor = colors.category[post.categoryId] || colors.primary;

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '18' }]}>
          <Text style={[styles.categoryText, { color: categoryColor }]}>
            {post.categoryId.replace('-', ' ')}
          </Text>
        </View>
        <Text style={styles.date}>{post.date}</Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>{post.title}</Text>
      <Text style={styles.content} numberOfLines={3}>{post.content}</Text>

      <View style={styles.footer}>
        <Text style={styles.author}>
          {post.isAnonymous ? t('common.anonymous') : post.author}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation?.();
              onLike?.();
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={post.isLiked ? 'heart' : 'heart-outline'}
              size={18}
              color={post.isLiked ? colors.status.error : colors.text.tertiary}
            />
            <Text style={styles.actionText}>{post.likes}</Text>
          </TouchableOpacity>
          <View style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={16} color={colors.text.tertiary} />
            <Text style={styles.actionText}>{post.comments}</Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  categoryText: {
    ...typography.caption,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  date: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  title: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  content: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  author: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.base,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionText: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
});
