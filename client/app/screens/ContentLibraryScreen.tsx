import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import Text from '../components/Text';
import ContentCard, { ContentType } from '../components/ContentCard';
import ScreenHeader from '../components/ScreenHeader';
import SearchBar from '../components/SearchBar';
import FilterChipList, { FilterChip } from '../components/FilterChipList';
import EmptyState from '../components/EmptyState';
import HelpFooterButton from '../components/HelpFooterButton';
import colors from '../config/colors';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchContent, fetchRecommendedContent, toggleFavorite, seedContentData } from '../store/slices/contentSlice';

const quickFilters: FilterChip[] = [
  { id: 'סיפור עצמי', label: 'סיפור עצמי', icon: 'emoticon-happy-outline', color: colors.warning, backgroundColor: colors.lightOrange },
  { id: 'מדיטציה', label: 'מדיטציה', icon: 'star-four-points', color: colors.primary, backgroundColor: colors.lightPurple },
  { id: 'נשימות להרגעה', label: 'נשימות להרגעה', icon: 'lungs', color: colors.pink, backgroundColor: colors.lightPink },
];

const categoryChips: FilterChip[] = [
  { id: 'הכל', label: 'הכל', activeColor: colors.warning },
  { id: 'הקלה מחרדה', label: 'הקלה מחרדה', activeColor: colors.warning },
  { id: 'שינה', label: 'שינה', activeColor: colors.warning },
  { id: 'לחץ', label: 'לחץ', activeColor: colors.warning },
  { id: 'מיינדפולנס', label: 'מיינדפולנס', activeColor: colors.warning },
  { id: 'סיפור עצמי', label: 'סיפור עצמי', activeColor: colors.warning },
];

export default function ContentLibraryScreen() {
  const dispatch = useAppDispatch();
  const { items, recommended, favorites, isLoading, error } = useAppSelector((state) => state.content);

  const [selectedCategory, setSelectedCategory] = useState('הכל');
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchContent());
    dispatch(fetchRecommendedContent());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      // If no content, try to seed
      if (items.length === 0) {
        dispatch(seedContentData()).then(() => {
          dispatch(fetchContent());
          dispatch(fetchRecommendedContent());
        });
      }
    }
  }, [error, items.length, dispatch]);

  const handleToggleFavorite = (id: string) => {
    dispatch(toggleFavorite(id));
  };

  const filteredContent = items.filter((item) => {
    if (selectedCategory !== 'הכל' && item.category !== selectedCategory) {
      return false;
    }
    if (selectedQuickFilter && !item.tags.includes(selectedQuickFilter)) {
      return false;
    }
    if (searchQuery && !item.title.includes(searchQuery) && !item.description.includes(searchQuery)) {
      return false;
    }
    return true;
  });

  const handleRefreshRecommended = () => {
    dispatch(fetchRecommendedContent());
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ScreenHeader
          iconName="meditation"
          title="תכנים מרגיעים"
          subtitle="תרגילי נשימה, מדיטציה, יוגה ועוד - התאמה אישית לכל מצב הרוח שלך"
        />

        {/* Quick Filters */}
        <FilterChipList
          chips={quickFilters}
          selectedId={selectedQuickFilter}
          onSelect={(id) => setSelectedQuickFilter(id)}
        />

        {/* Recommended Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>✨ מומלץ עבורך</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={handleRefreshRecommended}>
              <MaterialCommunityIcons
                name="refresh"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.refreshText}>רענן</Text>
            </TouchableOpacity>
          </View>

          {isLoading && recommended.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {recommended.map((item) => (
                <View key={item.id} style={styles.horizontalCard}>
                  <ContentCard
                    id={item.id}
                    title={item.title}
                    description={item.description}
                    duration={item.duration}
                    category={item.category}
                    type={item.type as ContentType}
                    gradientColors={item.gradientColors as [string, string, ...string[]]}
                    imageUrl={item.imageUrl}
                    tags={item.tags}
                    isFavorite={favorites.includes(item.id)}
                    onPress={() => console.log('Play content:', item.id)}
                    onToggleFavorite={() => handleToggleFavorite(item.id)}
                  />
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="חיפוש בתכנים..."
        />

        {/* Category Tabs */}
        <FilterChipList
          chips={categoryChips}
          selectedId={selectedCategory}
          onSelect={(id) => setSelectedCategory(id || 'הכל')}
          allowDeselect={false}
        />

        {/* All Content Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>✨ כל התכנים</Text>
            <Text style={styles.favoriteCount}>מועדפים ({favorites.length})</Text>
          </View>

          {isLoading && items.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>טוען תכנים...</Text>
            </View>
          ) : filteredContent.length === 0 ? (
            <EmptyState
              iconName="meditation"
              title="אין תכנים להצגה"
              subtitle="נסה לשנות את הסינון"
            />
          ) : (
            filteredContent.map((item) => (
              <ContentCard
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                duration={item.duration}
                category={item.category}
                type={item.type as ContentType}
                gradientColors={item.gradientColors as [string, string, ...string[]]}
                imageUrl={item.imageUrl}
                tags={item.tags}
                isFavorite={favorites.includes(item.id)}
                onPress={() => console.log('Play content:', item.id)}
                onToggleFavorite={() => handleToggleFavorite(item.id)}
              />
            ))
          )}
        </View>

        <View style={styles.bottomSpacing} />
        <HelpFooterButton />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  refreshText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  favoriteCount: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: colors.text.secondary,
  },
  horizontalScroll: {
    paddingRight: 20,
  },
  horizontalCard: {
    width: 300,
    marginLeft: 16,
  },
  bottomSpacing: {
    height: 40,
  },
});
