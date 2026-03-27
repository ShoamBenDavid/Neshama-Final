import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Header, LoadingState, ErrorState, Card } from '../components/ui';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchForumPost, togglePostLike, addPostComment } from '../store/slices/forumSlice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '../i18n';
import type { RootStackParamList } from '../navigation/StackNavigator';

type RouteParams = RouteProp<RootStackParamList, 'ForumPost'>;

export default function ForumPostScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteParams>();
  const dispatch = useAppDispatch();
  const { selectedPost, isLoading, error } = useAppSelector((state) => state.forum);
  const { postId } = route.params;
  const { t } = useTranslation();

  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    dispatch(fetchForumPost(postId));
  }, [dispatch, postId]);

  const handleComment = async () => {
    if (!comment.trim()) return;
    await dispatch(addPostComment({ id: postId, content: comment.trim(), isAnonymous }));
    setComment('');
    dispatch(fetchForumPost(postId));
  };

  if (isLoading && !selectedPost) return <LoadingState message={t('forum.loadingPost')} />;
  if (error && !selectedPost) return <ErrorState message={error} />;
  if (!selectedPost) return <ErrorState message={t('forum.postNotFound')} />;

  const categoryColor = colors.category[selectedPost.categoryId] || colors.primary;
  const commentsCount = (selectedPost.comments || []).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title={t('forum.post')} showBack />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          data={selectedPost.comments || []}
          keyExtractor={(_, index) => `comment-${index}`}
          ListHeaderComponent={
            <View style={styles.postContent}>
              <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '18' }]}>
                <Text style={[styles.categoryText, { color: categoryColor }]}>
                  {selectedPost.categoryId.replace('-', ' ')}
                </Text>
              </View>

              <Text style={styles.title}>{selectedPost.title}</Text>
              <Text style={styles.body}>{selectedPost.content}</Text>

              <View style={styles.metaRow}>
                <Text style={styles.author}>
                  {selectedPost.isAnonymous ? t('common.anonymous') : selectedPost.author}
                </Text>
                <Text style={styles.date}>{selectedPost.date}</Text>
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.action}
                  onPress={() => dispatch(togglePostLike(postId))}
                >
                  <Ionicons
                    name={selectedPost.isLiked ? 'heart' : 'heart-outline'}
                    size={22}
                    color={selectedPost.isLiked ? colors.status.error : colors.text.tertiary}
                  />
                  <Text style={styles.actionText}>{selectedPost.likes}</Text>
                </TouchableOpacity>
                <View style={styles.action}>
                  <Ionicons name="chatbubble-outline" size={20} color={colors.text.tertiary} />
                  <Text style={styles.actionText}>
                    {t('common.comments', { count: commentsCount })}
                  </Text>
                </View>
              </View>

              <Text style={styles.commentsTitle}>{t('forum.commentsSection')}</Text>
            </View>
          }
          renderItem={({ item }: { item: any }) => (
            <Card style={styles.commentCard} variant="outlined">
              <Text style={styles.commentAuthor}>
                {item.isAnonymous ? t('common.anonymous') : item.user?.name || t('common.user')}
              </Text>
              <Text style={styles.commentBody}>{item.content}</Text>
            </Card>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.noComments}>{t('forum.noComments')}</Text>
          }
        />

        <View style={[styles.commentInput, { paddingBottom: insets.bottom || spacing.md }]}>
          <View style={styles.anonymousRow}>
            <Text style={styles.anonymousLabel}>{t('forum.postAnonymously')}</Text>
            <Switch
              value={isAnonymous}
              onValueChange={setIsAnonymous}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={isAnonymous ? colors.primary : colors.text.tertiary}
            />
          </View>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              placeholder={t('forum.writeComment')}
              placeholderTextColor={colors.text.tertiary}
              value={comment}
              onChangeText={setComment}
              multiline
              maxLength={2000}
            />
            <TouchableOpacity
              style={[styles.sendBtn, !comment.trim() && styles.sendBtnDisabled]}
              onPress={handleComment}
              disabled={!comment.trim()}
            >
              <Ionicons name="send" size={18} color={colors.text.inverse} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: { flex: 1 },
  postContent: {
    paddingBottom: spacing.md,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
  },
  categoryText: {
    ...typography.captionMedium,
    textTransform: 'capitalize',
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  body: {
    ...typography.body,
    color: colors.text.primary,
    lineHeight: 26,
    marginBottom: spacing.base,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  author: {
    ...typography.captionMedium,
    color: colors.text.secondary,
  },
  date: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.xl,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionText: {
    ...typography.bodySm,
    color: colors.text.secondary,
  },
  commentsTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  commentCard: {
    marginBottom: spacing.sm,
  },
  commentAuthor: {
    ...typography.captionMedium,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  commentBody: {
    ...typography.body,
    color: colors.text.primary,
    lineHeight: 22,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  noComments: {
    ...typography.body,
    color: colors.text.tertiary,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  commentInput: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
  },
  anonymousRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  anonymousLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
    paddingVertical: spacing.xs,
  },
  textInput: {
    flex: 1,
    ...typography.body,
    color: colors.text.primary,
    maxHeight: 80,
    paddingVertical: spacing.sm,
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: colors.text.tertiary,
  },
});
