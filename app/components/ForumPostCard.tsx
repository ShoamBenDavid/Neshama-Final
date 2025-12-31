import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Text from './Text';
import colors from '../config/colors';

interface ForumPostCardProps {
  id: string;
  author: string;
  isAnonymous: boolean;
  date: string;
  title: string;
  content: string;
  category: {
    id: string;
    label: string;
    color: string;
  };
  likes: number;
  comments: number;
  onPress?: () => void;
  onLike?: () => void;
  onComment?: () => void;
}

export default function ForumPostCard({
  author,
  isAnonymous,
  date,
  title,
  content,
  category,
  likes,
  comments,
  onPress,
  onLike,
  onComment,
}: ForumPostCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.authorContainer}>
          <MaterialCommunityIcons
            name={isAnonymous ? 'incognito' : 'account-circle'}
            size={20}
            color={colors.text.secondary}
          />
          <Text style={styles.author}>
            {isAnonymous ? 'אנונימי' : author}
          </Text>
        </View>
        <Text style={styles.date}>{date}</Text>
      </View>

      {/* Content */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content} numberOfLines={3}>
        {content}
      </Text>

      {/* Footer */}
      <View style={styles.footer}>
        <View
          style={[styles.categoryBadge, { backgroundColor: category.color }]}
        >
          <Text style={styles.categoryText}>{category.label}</Text>
        </View>

        <View style={styles.interactions}>
          <TouchableOpacity
            style={styles.interactionButton}
            onPress={onComment}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="comment-outline"
              size={18}
              color={colors.text.secondary}
            />
            <Text style={styles.interactionText}>{comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.interactionButton}
            onPress={onLike}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="heart-outline"
              size={18}
              color={colors.text.secondary}
            />
            <Text style={styles.interactionText}>{likes}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  author: {
    fontSize: 13,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: colors.text.light,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'left',
  },
  content: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    textAlign: 'left',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    color: colors.white,
    fontWeight: '600',
  },
  interactions: {
    flexDirection: 'row',
    gap: 16,
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  interactionText: {
    fontSize: 13,
    color: colors.text.secondary,
  },
});

