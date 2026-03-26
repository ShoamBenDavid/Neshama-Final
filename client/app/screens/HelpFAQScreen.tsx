import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper, Header, Card, AccordionItem, Button } from '../components/ui';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { useTranslation } from '../i18n';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'gettingStarted' | 'privacy' | 'features';
}

export default function HelpFAQScreen() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const faqItems: FAQItem[] = useMemo(
    () => [
      {
        id: 'journaling',
        question: t('helpFaq.faqJournalingQ'),
        answer: t('helpFaq.faqJournalingA'),
        category: 'gettingStarted',
      },
      {
        id: 'aiChat',
        question: t('helpFaq.faqAiChatQ'),
        answer: t('helpFaq.faqAiChatA'),
        category: 'features',
      },
      {
        id: 'privacy',
        question: t('helpFaq.faqPrivacyQ'),
        answer: t('helpFaq.faqPrivacyA'),
        category: 'privacy',
      },
      {
        id: 'language',
        question: t('helpFaq.faqLanguageQ'),
        answer: t('helpFaq.faqLanguageA'),
        category: 'gettingStarted',
      },
      {
        id: 'supportCenter',
        question: t('helpFaq.faqSupportCenterQ'),
        answer: t('helpFaq.faqSupportCenterA'),
        category: 'features',
      },
      {
        id: 'notifications',
        question: t('helpFaq.faqNotificationsQ'),
        answer: t('helpFaq.faqNotificationsA'),
        category: 'features',
      },
      {
        id: 'moodTracking',
        question: t('helpFaq.faqMoodTrackingQ'),
        answer: t('helpFaq.faqMoodTrackingA'),
        category: 'features',
      },
      {
        id: 'community',
        question: t('helpFaq.faqCommunityQ'),
        answer: t('helpFaq.faqCommunityA'),
        category: 'features',
      },
      {
        id: 'data',
        question: t('helpFaq.faqDataQ'),
        answer: t('helpFaq.faqDataA'),
        category: 'privacy',
      },
      {
        id: 'offline',
        question: t('helpFaq.faqOfflineQ'),
        answer: t('helpFaq.faqOfflineA'),
        category: 'gettingStarted',
      },
    ],
    [t],
  );

  const categories = [
    { key: 'all', label: t('helpFaq.categories.all') },
    { key: 'gettingStarted', label: t('helpFaq.categories.gettingStarted') },
    { key: 'privacy', label: t('helpFaq.categories.privacy') },
    { key: 'features', label: t('helpFaq.categories.features') },
  ];

  const filteredItems = useMemo(() => {
    let items = faqItems;
    if (selectedCategory !== 'all') {
      items = items.filter((item) => item.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query),
      );
    }
    return items;
  }, [faqItems, selectedCategory, searchQuery]);

  const handleContactSupport = () => {
    // TODO: replace with actual support email or in-app support flow
    Linking.openURL('mailto:support@neshamaapp.com');
  };

  return (
    <ScreenWrapper>
      <Header title={t('helpFaq.title')} subtitle={t('helpFaq.subtitle')} showBack />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={colors.text.tertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('helpFaq.searchPlaceholder')}
          placeholderTextColor={colors.text.tertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={colors.text.tertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filters */}
      <View style={styles.categoryRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.categoryChip, selectedCategory === cat.key && styles.categoryChipActive]}
            onPress={() => setSelectedCategory(cat.key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.categoryLabel,
                selectedCategory === cat.key && styles.categoryLabelActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* FAQ Items */}
      {filteredItems.length > 0 ? (
        <View style={styles.faqList}>
          {filteredItems.map((item) => (
            <AccordionItem key={item.id} question={item.question} answer={item.answer} />
          ))}
        </View>
      ) : (
        <Card style={styles.emptyCard}>
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={40} color={colors.text.tertiary} />
            <Text style={styles.emptyTitle}>{t('helpFaq.noResults')}</Text>
            <Text style={styles.emptyDesc}>{t('helpFaq.noResultsDesc')}</Text>
          </View>
        </Card>
      )}

 

      {/* Contact Support */}
      <Card style={styles.contactCard}>
        <View style={styles.contactContent}>
          <Ionicons name="chatbubble-ellipses-outline" size={28} color={colors.primary} />
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>{t('helpFaq.contactSupport')}</Text>
            <Text style={styles.contactDesc}>{t('helpFaq.contactSupportDesc')}</Text>
          </View>
        </View>
        <Button
          title={t('helpFaq.contactSupport')}
          variant="outline"
          size="sm"
          onPress={handleContactSupport}
          style={styles.contactButton}
        />
      </Card>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
    ...shadows.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text.primary,
    marginHorizontal: spacing.sm,
    paddingVertical: 0,
  },
  categoryRow: {
    flexDirection: 'row',
    marginTop: spacing.base,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryLabel: {
    ...typography.captionMedium,
    color: colors.text.secondary,
  },
  categoryLabelActive: {
    color: colors.text.inverse,
  },
  faqList: {
    marginTop: spacing.sm,
  },
  emptyCard: {
    marginTop: spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    ...typography.h4,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  emptyDesc: {
    ...typography.bodySm,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  emergencyCard: {
    marginTop: spacing.xl,
    backgroundColor: colors.status.warning + '15',
    borderWidth: 1,
    borderColor: colors.status.warning + '40',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  emergencyTitle: {
    ...typography.bodyMedium,
    color: colors.status.warningDark,
  },
  emergencyText: {
    ...typography.bodySm,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  contactCard: {
    marginTop: spacing.base,
  },
  contactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.base,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  contactDesc: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  contactButton: {
    alignSelf: 'flex-start',
  },
});
