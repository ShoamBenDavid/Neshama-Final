import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, TextInput as RNTextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import Text from '../components/Text';
import ContentCard, { ContentType } from '../components/ContentCard';
import BackButton from '../components/BackButton';
import HelpFooterButton from '../components/HelpFooterButton';
import colors from '../config/colors';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  type: ContentType;
  gradientColors: [string, string, ...string[]];
  imageUrl?: string;
  tags: string[];
}

// Sample content data
const sampleContent: ContentItem[] = [
  {
    id: '1',
    title: 'מדיטציית הכרת תודה',
    description: 'מדיטציה להתמקדות בדברים הטובים בחיים ולשינוי נקודת מבט.',
    duration: '10 דקות',
    category: 'מיינדפולנס',
    type: 'meditation',
    gradientColors: ['#10B981', '#34D399'],
    tags: ['מיינדפולנס'],
  },
  {
    id: '2',
    title: 'תרגול חמלה עצמית',
    description: 'לנהל להיות סובים לעצמכם ולפתח מלפה עצמית.',
    duration: '12 דקות',
    category: 'סיפור עצמי',
    type: 'meditation',
    gradientColors: ['#8B5CF6', '#A78BFA'],
    tags: ['סיפור עצמי'],
  },
  {
    id: '3',
    title: 'מדיטציית סריקת גוף',
    description: 'מדיטציה מודרכת לשחרור מתחים בכל הגוף. סרוק כל אזור והרפה.',
    duration: '15 דקות',
    category: 'לחץ',
    type: 'meditation',
    gradientColors: ['#F59E0B', '#FBBF24'],
    tags: ['לחץ'],
  },
  {
    id: '4',
    title: 'תרגיל נשימה 4-7-8',
    description: 'טכניקה נשימה מהירה להפחתת חרדה. שאיפה 4 שניות, החזקת 7, נשיפה 8.',
    duration: '5 דקות',
    category: 'הקלה מתחרה',
    type: 'breathing',
    gradientColors: ['#EF4444', '#F87171'],
    tags: ['הקלה מתחרה'],
  },
  {
    id: '5',
    title: 'יוגה בוקר מרגיעה',
    description: 'רצף יוגה עדין להתחלה זורמת של מלאת אנרגיה חיובית.',
    duration: '20 דקות',
    category: 'שינה',
    type: 'yoga',
    gradientColors: ['#14B8A6', '#2DD4BF'],
    tags: ['שינה'],
  },
  {
    id: '6',
    title: 'נשימת קוסמה',
    description: 'טכניקה נשימה פשוטה להרגעה מהירה. מתאים 4 שניות, נשיפה 4.',
    duration: '3 דקות',
    category: 'הקלה מתחרה',
    type: 'breathing',
    gradientColors: ['#EF4444', '#F87171'],
    tags: ['הקלה מתחרה'],
  },
  {
    id: '7',
    title: 'מדריך הכנה לשינה',
    description: 'טיפים וטכניקות להכנה לשינה אוכיתית ומרענינה.',
    duration: '10 דקות',
    category: 'שינה',
    type: 'article',
    gradientColors: ['#A78BFA', '#C4B5FD'],
    tags: ['שינה'],
  },
  {
    id: '8',
    title: 'להבין חרדה',
    description: 'מדריך מקיף להבנת חרדה, הסימנים, וטכניקות התמודדות.',
    duration: '15 דקות',
    category: 'מוסיקה',
    type: 'article',
    gradientColors: ['#DC2626', '#EF4444'],
    tags: ['מוסיקה'],
  },
  {
    id: '9',
    title: 'הקלה מהירה מלחץ',
    description: 'תרגילים מהירים של 5 דקות להקלה מידית מלחץ.',
    duration: '5 דקות',
    category: 'לחץ',
    type: 'video',
    gradientColors: ['#B45309', '#D97706'],
    tags: ['לחץ'],
  },
  {
    id: '10',
    title: 'אמירות חיוביות',
    description: 'אמירות חיוביות יומיות לשיפור האופטימי והעצמה אישית.',
    duration: '8 דקות',
    category: 'מוסיקה',
    type: 'audio',
    gradientColors: ['#B45309', '#D97706'],
    tags: ['מוסיקה'],
  },
];

const categories = [
  'הכל',
  'הקלה מתחרה',
  'שינה',
  'לחץ',
  'מיינדפולנס',
  'סיפור עצמי',
  'יוגה',
  'אומרים',
  'ווידאו',
];

const quickFilters = ['סיפור עצמי', 'מדיטציה', 'נשימות להרגעה'];

export default function ContentLibraryScreen() {
  const [selectedCategory, setSelectedCategory] = useState('הכל');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const filteredContent = sampleContent.filter((item) => {
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

  const recommendedContent = sampleContent.slice(0, 4);

  return (
    <Screen style={styles.screen}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <MaterialCommunityIcons
              name="meditation"
              size={32}
              color={colors.primary}
            />
            <View style={styles.headerText}>
            <View style={{alignItems: 'flex-start'}}>
              <Text style={styles.headerTitle}>תכנים מרגיעים</Text>
              <Text style={styles.headerSubtitle}>
                תרגילי נשימה, מדיטציה, יוגה ועוד - התאמה אישית לכל מצב הרוח שלך
              </Text>
            </View>
            </View>
            <BackButton />     
          </View>
       
        </View>

        {/* Quick Filters */}
        <View style={styles.quickFiltersContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickFilters}
          >
            {quickFilters.map((filter, index) => {
              const isActive = selectedQuickFilter === filter;
              const buttonColors = [
                colors.lightOrange,
                colors.lightPurple,
                colors.lightPink,
              ];
              const textColors = [colors.warning, colors.primary, colors.pink];

              return (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.quickFilterButton,
                    {
                      backgroundColor: isActive
                        ? textColors[index]
                        : buttonColors[index],
                    },
                  ]}
                  onPress={() =>
                    setSelectedQuickFilter(isActive ? null : filter)
                  }
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name={
                      index === 0
                        ? 'emoticon-happy-outline'
                        : index === 1
                        ? 'star-four-points'
                        : 'lungs'
                    }
                    size={18}
                    color={isActive ? colors.white : textColors[index]}
                  />
                  <Text
                    style={[
                      styles.quickFilterText,
                      {
                        color: isActive ? colors.white : textColors[index],
                      },
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Recommended Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>✨ מומלץ עבורך</Text>
            <TouchableOpacity style={styles.refreshButton}>
              <MaterialCommunityIcons
                name="refresh"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.refreshText}>רענן</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {recommendedContent.map((item) => (
              <View key={item.id} style={styles.horizontalCard}>
                <ContentCard
                  {...item}
                  isFavorite={favorites.includes(item.id)}
                  onPress={() => console.log('Play content:', item.id)}
                  onToggleFavorite={() => toggleFavorite(item.id)}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={colors.text.secondary}
          />
          <RNTextInput
            style={styles.searchInput}
            placeholder="חיפוש בתכנים..."
            placeholderTextColor={colors.text.light}
            value={searchQuery}
            onChangeText={setSearchQuery}
            textAlign="right"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <MaterialCommunityIcons
                name="close-circle"
                size={20}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Tabs */}
        <View style={styles.categoryTabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryTabs}
          >
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryTab,
                    isActive && styles.categoryTabActive,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.categoryTabText,
                      isActive && styles.categoryTabTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* All Content Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>✨ כל התכנים</Text>
            <Text style={styles.favoriteCount}>מועדפים ({favorites.length})</Text>
          </View>

          {filteredContent.map((item) => (
            <ContentCard
              key={item.id}
              {...item}
              isFavorite={favorites.includes(item.id)}
              onPress={() => console.log('Play content:', item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
            />
          ))}

          {filteredContent.length === 0 && (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="meditation"
                size={64}
                color={colors.text.light}
              />
              <Text style={styles.emptyStateText}>אין תכנים להצגה</Text>
              <Text style={styles.emptyStateSubtext}>
                נסה לשנות את הסינון
              </Text>
            </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerText: {
   flex: 1,
   textAlign: 'right',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 6,
    textAlign: 'right',

  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 20,

    alignItems: 'flex-start'
  },
  quickFiltersContainer: {
    marginBottom: 20,
  },
  quickFilters: {
    paddingHorizontal: 20,
    gap: 12,
  },
  quickFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  quickFilterText: {
    fontSize: 14,
    fontWeight: '600',
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
  horizontalScroll: {
    paddingRight: 20,
  },
  horizontalCard: {
    width: 300,
    marginLeft: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text.primary,
  },
  clearButton: {
    padding: 4,
  },
  categoryTabsContainer: {
    marginBottom: 20,
  },
  categoryTabs: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
  },
  categoryTabActive: {
    backgroundColor: colors.warning,
  },
  categoryTabText: {
    fontSize: 13,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  categoryTabTextActive: {
    color: colors.white,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.secondary,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.text.light,
    marginTop: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});

