import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput as RNTextInput,
  Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import Text from '../components/Text';
import CategoryTabs, { Category } from '../components/CategoryTabs';
import ForumPostCard from '../components/ForumPostCard';
import BackButton from '../components/BackButton';
import HelpFooterButton from '../components/HelpFooterButton';
import colors from '../config/colors';

interface ForumPost {
  id: string;
  author: string;
  isAnonymous: boolean;
  date: string;
  title: string;
  content: string;
  categoryId: string;
  likes: number;
  comments: number;
}

// Categories with colors
const categories: Category[] = [
  { id: 'all', label: 'הכל', color: colors.danger },
  { id: 'anxiety', label: 'חרדה', color: colors.orange },
  { id: 'depression', label: 'דיכאון', color: colors.info },
  { id: 'relationships', label: 'יחסים', color: colors.pink },
  { id: 'work-stress', label: 'לחץ בעבודה', color: colors.danger },
  { id: 'success', label: 'סיפורי הצלחה', color: colors.success },
  { id: 'popular', label: 'פופולריים', color: colors.purple },
  { id: 'recent', label: 'אחרונים', color: colors.teal },
];

const categoryColors: { [key: string]: string } = {
  anxiety: colors.orange,
  depression: colors.info,
  relationships: colors.pink,
  'work-stress': colors.danger,
  success: colors.success,
};

// Sample posts
const samplePosts: ForumPost[] = [
  {
    id: '1',
    author: 'אנונימי',
    isAnonymous: true,
    date: 'בדצמבר 2, 2025',
    title: 'רגעים קשים בעבודה - איך מתמודדים?',
    content:
      'היי לכולם, אני עובר בתקופה האתגרונה בחלקו הלוקו וגומר. מרגיש שאני לא מצליח להירדם בערב ואז הלילות קשים. מישהו מכיר את ההרגשה הזו?',
    categoryId: 'work-stress',
    likes: 12,
    comments: 3,
  },
  {
    id: '2',
    author: 'מיכל',
    isAnonymous: false,
    date: 'בדצמבר 2, 2025',
    title: 'סיפור הצלחה - התחלתי לרוץ אחרי 3 שנים!',
    content:
      'רציתי לשתף שאחרי 3 שנים של תקופה קשה, התחלתי לרוץ מחר שוב לי היה מדיטציה ויוגרמית ויומן רגשי. אם גם אתם מרגישים שאין תקווה - תמיד, זה נמצא.',
    categoryId: 'success',
    likes: 45,
    comments: 8,
  },
  {
    id: '3',
    author: 'אנונימי',
    isAnonymous: true,
    date: 'בדצמבר 2, 2025',
    title: 'חרדה חברתית - מישהו גם סובל מזה?',
    content:
      'מאוד שאני זוכרת את עצמי, המחנכים והחברתיים מטרידים לי חרדה גדולה. מסכף לפגוש אנשים חדשים, דואג לפני מפגשים. האם מישהו מכיר את זאת? איך מתמודדים?',
    categoryId: 'anxiety',
    likes: 23,
    comments: 5,
  },
  {
    id: '4',
    author: 'אנונימי',
    isAnonymous: true,
    date: 'בדצמבר 2, 2025',
    title: 'יחסים עם בן/בת זוג - איך מדברים?',
    content:
      'אנחנו ביחד כבר 5 שנים והתקשורה נהייתה יותר קשה. אנחנו לא מצליחים לדבר בכל ליבי. יש למישהו עצות איך לשפר תקשורת?',
    categoryId: 'relationships',
    likes: 18,
    comments: 6,
  },
];

export default function ForumScreen() {
  const [posts] = useState<ForumPost[]>(samplePosts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === 'all' || post.categoryId === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      post.title.includes(searchQuery) ||
      post.content.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.likes - a.likes;
    }
    return 0; // Keep original order for recent
  });

  const getCategoryInfo = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return {
      id: categoryId,
      label: category?.label || categoryId,
      color: categoryColors[categoryId] || colors.gray[400],
    };
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <MaterialCommunityIcons
              name="account-group"
              size={32}
              color={colors.primary}
            />
            <View style={styles.headerText}>
              <View style={{alignItems: 'flex-start'}}>
              <Text style={styles.headerTitle}>קהילת התמיכה</Text>
              <Text style={styles.headerSubtitle}>
                שתף, שאל, ותמוך - יחד אנחנו חזקים יותר
              </Text>
              </View>
            </View>
          </View>
          <BackButton />
        </View>

        {/* New Post Button */}
        <TouchableOpacity
          style={styles.newPostButton}
          onPress={() => setShowNewPostModal(true)}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="plus" size={20} color={colors.white} />
          <Text style={styles.newPostButtonText}>פוסט חדש</Text>
        </TouchableOpacity>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={colors.text.secondary}
          />
          <RNTextInput
            style={styles.searchInput}
            placeholder="חיפוש בפורום..."
            placeholderTextColor={colors.text.light}
            value={searchQuery}
            onChangeText={setSearchQuery}
            textAlign="right"
          />
        </View>

        {/* Category Tabs */}
        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Sort Options */}
        <View style={styles.sortContainer}>
          <View style={styles.sortButtons}>
            <TouchableOpacity
              style={[
                styles.sortButton,
                sortBy === 'recent' && styles.sortButtonActive,
              ]}
              onPress={() => setSortBy('recent')}
            >
              <MaterialCommunityIcons
                name="clock-outline"
                size={16}
                color={sortBy === 'recent' ? colors.primary : colors.text.secondary}
              />
              <Text
                style={[
                  styles.sortButtonText,
                  sortBy === 'recent' && styles.sortButtonTextActive,
                ]}
              >
                אחרונים
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sortButton,
                sortBy === 'popular' && styles.sortButtonActive,
              ]}
              onPress={() => setSortBy('popular')}
            >
              <MaterialCommunityIcons
                name="fire"
                size={16}
                color={sortBy === 'popular' ? colors.primary : colors.text.secondary}
              />
              <Text
                style={[
                  styles.sortButtonText,
                  sortBy === 'popular' && styles.sortButtonTextActive,
                ]}
              >
                פופולריים
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Posts List */}
        <View style={styles.postsContainer}>
          {sortedPosts.map((post) => (
            <ForumPostCard
              key={post.id}
              {...post}
              category={getCategoryInfo(post.categoryId)}
              onPress={() => console.log('View post:', post.id)}
              onLike={() => console.log('Like post:', post.id)}
              onComment={() => console.log('Comment on post:', post.id)}
            />
          ))}

          {sortedPosts.length === 0 && (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="forum-outline"
                size={64}
                color={colors.text.light}
              />
              <Text style={styles.emptyStateText}>אין פוסטים להצגה</Text>
              <Text style={styles.emptyStateSubtext}>
                נסה לשנות את הסינון או החיפוש
              </Text>
            </View>
          )}
        </View>

        <View style={styles.bottomSpacing} />
        <HelpFooterButton />
      </ScrollView>

      {/* New Post Modal */}
      <Modal
        visible={showNewPostModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNewPostModal(false)}
      >
        <Screen style={styles.modalScreen}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowNewPostModal(false)}
              style={styles.modalCloseButton}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={colors.text.primary}
              />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>פוסט חדש</Text>
            <TouchableOpacity
              onPress={() => {
                console.log('Save post');
                setShowNewPostModal(false);
              }}
              style={styles.modalSaveButton}
            >
              <Text style={styles.modalSaveText}>פרסם</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Anonymous Toggle */}
            <View style={styles.anonymousToggle}>
              <View style={styles.toggleLeft}>
                <MaterialCommunityIcons
                  name="incognito"
                  size={20}
                  color={colors.text.secondary}
                />
                <Text style={styles.toggleText}>פרסם באופן אנונימי</Text>
              </View>
              <View style={styles.switch}>
                <MaterialCommunityIcons
                  name="toggle-switch"
                  size={40}
                  color={colors.primary}
                />
              </View>
            </View>

            {/* Category Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>בחר קטגוריה</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categorySelection}
              >
                {categories
                  .filter((c) => c.id !== 'all' && c.id !== 'popular' && c.id !== 'recent')
                  .map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryOption,
                        { backgroundColor: category.color + '20' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryOptionText,
                          { color: category.color },
                        ]}
                      >
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>

            {/* Title Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>כותרת</Text>
              <RNTextInput
                style={styles.titleInput}
                placeholder="הוסף כותרת לפוסט..."
                placeholderTextColor={colors.text.light}
                textAlign="left"
              />
            </View>

            {/* Content Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>תוכן הפוסט</Text>
              <RNTextInput
                style={styles.contentInput}
                placeholder="שתף את המחשבות שלך עם הקהילה..."
                placeholderTextColor={colors.text.light}
                multiline
                numberOfLines={10}
                textAlign="left"
                textAlignVertical="top"
              />
            </View>

            {/* Community Guidelines */}
            <View style={styles.guidelinesCard}>
              <MaterialCommunityIcons
                name="shield-check"
                size={20}
                color={colors.success}
              />
              <View style={styles.guidelinesText}>
                <Text style={styles.guidelinesTitle}>כללי הקהילה</Text>
                <Text style={styles.guidelinesSubtitle}>
                  היה מכבד, תומך ואמפטי. זכור שכולנו כאן כדי לעזור אחד לשני.
                </Text>
              </View>
            </View>
          </ScrollView>
        </Screen>
      </Modal>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerText: {
    flex: 1,
    textAlign: 'left',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'left',
    
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 2,
    textAlign: 'left',
  },
  newPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.danger,
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newPostButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
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
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text.primary,
  },
  sortContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
  },
  sortButtonActive: {
    backgroundColor: colors.lightPurple,
  },
  sortButtonText: {
    fontSize: 13,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  sortButtonTextActive: {
    color: colors.primary,
  },
  postsContainer: {
    paddingHorizontal: 20,
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
  modalScreen: {
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  modalCloseButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  modalSaveButton: {
    width: 60,
    alignItems: 'flex-end',
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  anonymousToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  toggleText: {
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: '600',
  },
  switch: {},
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'left',
  },
  categorySelection: {
    flexDirection: 'row',
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
  categoryOptionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  titleInput: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  contentInput: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: colors.text.primary,
    minHeight: 200,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  guidelinesCard: {
    flexDirection: 'row',
    backgroundColor: colors.lightGreen,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  guidelinesText: {
    flex: 1,
  },
  guidelinesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'left',
    marginBottom: 4,
  },
  guidelinesSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'left',
    lineHeight: 18,
  },
});

