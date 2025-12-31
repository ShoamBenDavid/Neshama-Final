import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
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

const quickFilters: FilterChip[] = [
  { id: 'סיפור עצמי', label: 'סיפור עצמי', icon: 'emoticon-happy-outline', color: colors.warning, backgroundColor: colors.lightOrange },
  { id: 'מדיטציה', label: 'מדיטציה', icon: 'star-four-points', color: colors.primary, backgroundColor: colors.lightPurple },
  { id: 'נשימות להרגעה', label: 'נשימות להרגעה', icon: 'lungs', color: colors.pink, backgroundColor: colors.lightPink },
];

const categoryChips: FilterChip[] = [
  { id: 'הכל', label: 'הכל', activeColor: colors.warning },
  { id: 'הקלה מתחרה', label: 'הקלה מתחרה', activeColor: colors.warning },
  { id: 'שינה', label: 'שינה', activeColor: colors.warning },
  { id: 'לחץ', label: 'לחץ', activeColor: colors.warning },
  { id: 'מיינדפולנס', label: 'מיינדפולנס', activeColor: colors.warning },
  { id: 'סיפור עצמי', label: 'סיפור עצמי', activeColor: colors.warning },
  { id: 'יוגה', label: 'יוגה', activeColor: colors.warning },
  { id: 'אומרים', label: 'אומרים', activeColor: colors.warning },
  { id: 'ווידאו', label: 'ווידאו', activeColor: colors.warning },
];

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
            <EmptyState
              iconName="meditation"
              title="אין תכנים להצגה"
              subtitle="נסה לשנות את הסינון"
            />
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
