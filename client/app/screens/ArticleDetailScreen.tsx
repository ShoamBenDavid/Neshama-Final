import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/ui';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { wellnessArticles } from '../content';
import type { RootStackParamList } from '../navigation/StackNavigator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '../i18n';

type RouteParams = RouteProp<RootStackParamList, 'ArticleDetail'>;

export default function ArticleDetailScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteParams>();
  const article = wellnessArticles.find((a) => a.id === route.params.articleId);
  const [readProgress, setReadProgress] = useState(0);

  if (!article) return null;

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const scrollableHeight = contentSize.height - layoutMeasurement.height;
    if (scrollableHeight > 0) {
      setReadProgress(Math.min(contentOffset.y / scrollableHeight, 1));
    }
  };

  const paragraphs = article.content.split('\n\n').filter(Boolean);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${readProgress * 100}%` }]} />
      </View>

      <Header title={t('articles.articleScreenTitle')} showBack />

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={article.gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <Text style={styles.heroCategory}>{article.category}</Text>
          <Text style={styles.heroTitle}>{article.title}</Text>
          <View style={styles.heroMeta}>
            <Text style={styles.heroMetaText}>{t('common.minRead', { time: article.readTime })}</Text>
            <View style={styles.dot} />
            <Text style={styles.heroMetaText}>{article.author}</Text>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {paragraphs.map((paragraph, index) => {
            if (paragraph.startsWith('## ')) {
              return (
                <Text key={index} style={styles.heading}>
                  {paragraph.replace('## ', '')}
                </Text>
              );
            }
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
              return (
                <Text key={index} style={styles.boldParagraph}>
                  {paragraph.replace(/\*\*/g, '')}
                </Text>
              );
            }
            if (paragraph.startsWith('- ')) {
              const items = paragraph.split('\n').filter(Boolean);
              return (
                <View key={index} style={styles.listContainer}>
                  {items.map((item, i) => (
                    <View key={i} style={styles.listItem}>
                      <View style={styles.bullet} />
                      <Text style={styles.listText}>
                        {item.replace(/^- \*\*(.+?)\*\*:?\s*/, '').trim() || item.replace('- ', '')}
                      </Text>
                    </View>
                  ))}
                </View>
              );
            }
            if (paragraph.startsWith('*') && paragraph.endsWith('*')) {
              return (
                <Text key={index} style={styles.italicText}>
                  {paragraph.replace(/\*/g, '')}
                </Text>
              );
            }
            return (
              <Text key={index} style={styles.paragraph}>
                {paragraph.replace(/\*\*(.+?)\*\*/g, '$1')}
              </Text>
            );
          })}
        </View>

        <View style={styles.tagsSection}>
          {article.tags.map((tag, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  progressBarContainer: {
    height: 3,
    backgroundColor: colors.borderLight,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  content: {
    paddingBottom: spacing['3xl'],
  },
  heroGradient: {
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xl,
  },
  heroCategory: {
    ...typography.label,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: spacing.sm,
  },
  heroTitle: {
    ...typography.h2,
    color: '#fff',
    lineHeight: 34,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  heroMetaText: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.7)',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  body: {
    paddingHorizontal: spacing.lg,
  },
  heading: {
    ...typography.h3,
    color: colors.text.primary,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  paragraph: {
    ...typography.body,
    color: colors.text.primary,
    lineHeight: 26,
    marginBottom: spacing.base,
  },
  boldParagraph: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    lineHeight: 26,
    marginBottom: spacing.base,
  },
  italicText: {
    ...typography.body,
    fontStyle: 'italic',
    color: colors.text.secondary,
    lineHeight: 26,
    marginBottom: spacing.base,
  },
  listContainer: {
    marginBottom: spacing.base,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 8,
    marginRight: spacing.md,
  },
  listText: {
    ...typography.body,
    color: colors.text.primary,
    lineHeight: 24,
    flex: 1,
  },
  tagsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  tag: {
    backgroundColor: colors.primaryLight + '18',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  tagText: {
    ...typography.caption,
    color: colors.primary,
  },
});
