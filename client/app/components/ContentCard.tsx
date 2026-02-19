import React from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Text from './Text';
import colors from '../config/colors';

export type ContentType = 'meditation' | 'breathing' | 'audio' | 'video' | 'article' | 'yoga';

interface ContentCardProps {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  type: ContentType;
  gradientColors: [string, string, ...string[]];
  imageUrl?: string;
  isFavorite?: boolean;
  onPress?: () => void;
  onToggleFavorite?: () => void;
}

const contentIcons: { [key in ContentType]: string } = {
  meditation: 'star-four-points',
  breathing: 'lungs',
  audio: 'headphones',
  video: 'play-circle',
  article: 'book-open-variant',
  yoga: 'yoga',
};

const categoryColors: { [key: string]: string } = {
  מדיטציה: colors.lightPurple,
  נשימות: colors.lightPink,
  יוגה: colors.lightTeal,
  שינה: colors.lightBlue,
  'הקלה מתחרה': colors.lightOrange,
  לחץ: colors.lightPink,
  מיינדפולנס: colors.lightGreen,
  'סיפור עצמי': colors.lightOrange,
  מוסיקה: colors.lightBlue,
  אודיו: colors.lightOrange,
};

export default function ContentCard({
  title,
  description,
  duration,
  category,
  type,
  gradientColors,
  imageUrl,
  isFavorite = false,
  onPress,
  onToggleFavorite,
}: ContentCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {imageUrl && (
          <ImageBackground
            source={{ uri: imageUrl }}
            style={styles.imageBackground}
            imageStyle={styles.image}
          />
        )}

        {/* Overlay for better text readability */}
        <View style={styles.overlay} />

        {/* Favorite button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onToggleFavorite}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={colors.white}
          />
        </TouchableOpacity>

        {/* Category badge */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>

        {/* Content type icon */}
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={contentIcons[type] as any}
            size={32}
            color={colors.white}
          />
        </View>
      </LinearGradient>

      {/* Content info */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
        <View style={styles.footer}>
          <View
            style={[
              styles.tag,
              { backgroundColor: categoryColors[category] || colors.gray[100] },
            ]}
          >
            <Text style={styles.tagText}>{category}</Text>
          </View>
          <View style={styles.durationContainer}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={14}
              color={colors.text.secondary}
            />
            <Text style={styles.duration}>{duration}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: colors.cardBackground,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  gradient: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imageBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text.primary,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 6,
    textAlign: 'left',
  },
  description: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
    marginBottom: 12,
    textAlign: 'left',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    color: colors.text.primary,
    fontWeight: '600',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  duration: {
    fontSize: 12,
    color: colors.text.secondary,
  },
});

