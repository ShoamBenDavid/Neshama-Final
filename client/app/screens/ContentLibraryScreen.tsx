import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper, Header, EmptyState } from '../components/ui';
import ContentCard from '../components/ui/ContentCard';
import ContentSection from '../components/ui/ContentSection';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { useTranslation } from '../i18n';
import {
  getAllContent,
  getGroupedContent,
  CATEGORIES,
  type RegistryItem,
  type ContentCategory,
} from '../content/contentRegistry';
import type { RootStackParamList } from '../navigation/StackNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type FilterId = 'all' | ContentCategory;

export default function ContentLibraryScreen() {
  const navigation = useNavigation<Nav>();
  const { t, language } = useTranslation();

  const [activeFilter, setActiveFilter] = useState<FilterId>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allContent = useMemo(() => getAllContent(language), [language]);
  const groupedContent = useMemo(() => getGroupedContent(language), [language]);

  const FILTER_CHIPS = useMemo(
    () => [
      { id: 'all' as FilterId, label: t('content.typeAll'), icon: 'grid-outline' as const },
      ...CATEGORIES.map((cat) => ({
        id: cat.id as FilterId,
        label: t(cat.labelKey),
        icon: cat.icon,
      })),
    ],
    [t],
  );

  const filteredItems = useMemo(() => {
    let items = activeFilter === 'all'
      ? allContent
      : allContent.filter((item) => item.category === activeFilter);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(q)),
      );
    }

    return items;
  }, [allContent, activeFilter, searchQuery]);

  const handleItemPress = useCallback(
    (item: RegistryItem) => {
      const { screen, params } = item.navigationTarget;
      (navigation.navigate as Function)(screen, params);
    },
    [navigation],
  );

  const handleSeeAll = useCallback(
    (categoryId: ContentCategory) => {
      setActiveFilter(categoryId);
      setSearchQuery('');
    },
    [],
  );

  const isSearching = searchQuery.trim().length > 0;
  const showGrouped = activeFilter === 'all' && !isSearching;

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <Header
        title={t('content.resources')}
        showBack
        subtitle={t('content.resourcesSubtitle')}
      />

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={colors.text.tertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('content.searchPlaceholder')}
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.text.tertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

    <View>
      <FlatList
        horizontal
        data={FILTER_CHIPS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isActive = activeFilter === item.id;
          return (
            <TouchableOpacity
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => {
                setActiveFilter(item.id);
                if (item.id !== 'all') setSearchQuery('');
              }}
            >
              <Ionicons
                name={item.icon}
                size={15}
                color={isActive ? colors.text.inverse : colors.text.secondary}
              />
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.chipsRow}
        showsHorizontalScrollIndicator={false}
        style={styles.chipsContainer}
      />
</View>
      {/* Content area */}
      {showGrouped ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {groupedContent.map((group) => (
            <ContentSection
              key={group.category.id}
              category={group.category}
              items={group.items}
              categoryLabel={t(group.category.labelKey)}
              seeAllLabel={t('common.seeAll')}
              onItemPress={handleItemPress}
              onSeeAll={() => handleSeeAll(group.category.id)}
            />
          ))}
        </ScrollView>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ContentCard item={item} onPress={() => handleItemPress(item)} variant="full" />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            filteredItems.length > 0 ? (
              <Text style={styles.resultsCount}>
                {t('content.itemsCount', { count: filteredItems.length })}
              </Text>
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              icon="library-outline"
              title={t('content.noResources')}
              message={t('content.tryDifferentCategory')}
            />
          }
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 44,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text.primary,
    paddingVertical: 0,
  },
  chipsContainer: {
    maxHeight: 44,
    marginBottom: spacing.md,
  },
  chipsRow: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
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
  scrollContent: {
    paddingBottom: spacing['3xl'],
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  resultsCount: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginBottom: spacing.md,
  },
});
