import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import Text from '../components/Text';
import CategoryTabs, { Category } from '../components/CategoryTabs';
import ForumPostCard from '../components/ForumPostCard';
import ScreenHeader from '../components/ScreenHeader';
import SearchBar from '../components/SearchBar';
import ModalHeader from '../components/ModalHeader';
import EmptyState from '../components/EmptyState';
import FormInput from '../components/FormInput';
import InfoCard from '../components/InfoCard';
import FilterChip from '../components/FilterChip';
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
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

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
    return 0;
  });

  const getCategoryInfo = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return {
      id: categoryId,
      label: category?.label || categoryId,
      color: categoryColors[categoryId] || colors.gray[400],
    };
  };

  const handleSavePost = () => {
    console.log('Save post:', { title: newPostTitle, content: newPostContent });
    setShowNewPostModal(false);
    setNewPostTitle('');
    setNewPostContent('');
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          icon="account-group"
          title="קהילת התמיכה"
          subtitle="שתף, שאל, ותמוך - יחד אנחנו חזקים יותר"
        />

        {/* New Post Button */}
        <TouchableOpacity
          style={styles.newPostButton}
          onPress={() => setShowNewPostModal(true)}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="plus" size={20} color={colors.white} />
          <Text style={styles.newPostButtonText}>פוסט חדש</Text>
        </TouchableOpacity>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="חיפוש בפורום..."
        />

        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Sort Options */}
        <View style={styles.sortContainer}>
          <View style={styles.sortButtons}>
            <FilterChip
              label="אחרונים"
              icon="clock-outline"
              isActive={sortBy === 'recent'}
              onPress={() => setSortBy('recent')}
              activeColor={colors.lightPurple}
              inactiveColor={colors.gray[100]}
            />
            <FilterChip
              label="פופולריים"
              icon="fire"
              isActive={sortBy === 'popular'}
              onPress={() => setSortBy('popular')}
              activeColor={colors.lightPurple}
              inactiveColor={colors.gray[100]}
            />
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
            <EmptyState
              icon="forum-outline"
              title="אין פוסטים להצגה"
              subtitle="נסה לשנות את הסינון או החיפוש"
            />
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
          <ModalHeader
            title="פוסט חדש"
            onClose={() => setShowNewPostModal(false)}
            onSave={handleSavePost}
            saveText="פרסם"
          />

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
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
              <MaterialCommunityIcons
                name="toggle-switch"
                size={40}
                color={colors.primary}
              />
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
                      <Text style={[styles.categoryOptionText, { color: category.color }]}>
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>

            <FormInput
              label="כותרת"
              placeholder="הוסף כותרת לפוסט..."
              value={newPostTitle}
              onChangeText={setNewPostTitle}
            />

            <FormInput
              label="תוכן הפוסט"
              placeholder="שתף את המחשבות שלך עם הקהילה..."
              value={newPostContent}
              onChangeText={setNewPostContent}
              multiline
            />

            <InfoCard
              icon="shield-check"
              title="כללי הקהילה"
              message="היה מכבד, תומך ואמפטי. זכור שכולנו כאן כדי לעזור אחד לשני."
              variant="success"
            />
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
  sortContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  postsContainer: {
    paddingHorizontal: 20,
  },
  bottomSpacing: {
    height: 40,
  },
  modalScreen: {
    backgroundColor: colors.background,
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
});
