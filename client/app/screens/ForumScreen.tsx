import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import Text from '../components/Text';
import CategoryTabs, { Category } from '../components/CategoryTabs';
import ForumPostCard from '../components/ForumPostCard';
import ScreenHeader from '../components/ScreenHeader';
import SearchBar from '../components/SearchBar';
import ModalHeader from '../components/ModalHeader';
import FormInput from '../components/FormInput';
import InfoBanner from '../components/InfoBanner';
import FilterChipList, { FilterChip } from '../components/FilterChipList';
import EmptyState from '../components/EmptyState';
import HelpFooterButton from '../components/HelpFooterButton';
import colors from '../config/colors';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchForumPosts, createForumPost, togglePostLike } from '../store/slices/forumSlice';

// Categories with colors
const categories: Category[] = [
  { id: 'all', label: 'הכל', color: colors.danger },
  { id: 'anxiety', label: 'חרדה', color: colors.orange },
  { id: 'depression', label: 'דיכאון', color: colors.info },
  { id: 'relationships', label: 'יחסים', color: colors.pink },
  { id: 'work-stress', label: 'לחץ בעבודה', color: colors.danger },
  { id: 'success', label: 'סיפורי הצלחה', color: colors.success },
];

const categoryColors: { [key: string]: string } = {
  anxiety: colors.orange,
  depression: colors.info,
  relationships: colors.pink,
  'work-stress': colors.danger,
  success: colors.success,
  general: colors.gray[400],
};

const sortChips: FilterChip[] = [
  { id: 'recent', label: 'אחרונים', icon: 'clock-outline', color: colors.text.secondary, activeColor: colors.primary, backgroundColor: colors.gray[100] },
  { id: 'popular', label: 'פופולריים', icon: 'fire', color: colors.text.secondary, activeColor: colors.primary, backgroundColor: colors.gray[100] },
];

export default function ForumScreen() {
  const dispatch = useAppDispatch();
  const { posts, isLoading, isCreating, error } = useAppSelector((state) => state.forum);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [sortBy, setSortBy] = useState<string>('recent');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<string>('general');
  const [isAnonymous, setIsAnonymous] = useState(true);

  useEffect(() => {
    dispatch(fetchForumPosts({ category: selectedCategory, sort: sortBy, search: searchQuery }));
  }, [dispatch, selectedCategory, sortBy]);

  useEffect(() => {
    if (error) {
      Alert.alert('שגיאה', error);
    }
  }, [error]);

  const handleSearch = () => {
    dispatch(fetchForumPosts({ category: selectedCategory, sort: sortBy, search: searchQuery }));
  };

  const getCategoryInfo = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return {
      id: categoryId,
      label: category?.label || categoryId,
      color: categoryColors[categoryId] || colors.gray[400],
    };
  };

  const handleSavePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      Alert.alert('שגיאה', 'אנא מלא את כל השדות');
      return;
    }

    const result = await dispatch(createForumPost({
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      categoryId: newPostCategory,
      isAnonymous,
    }));

    if (createForumPost.fulfilled.match(result)) {
      setShowNewPostModal(false);
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostCategory('general');
    }
  };

  const handleLike = (postId: string) => {
    dispatch(togglePostLike(postId));
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ScreenHeader
          iconName="account-group"
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

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="חיפוש בפורום..."
          onSubmitEditing={handleSearch}
        />

        {/* Category Tabs */}
        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Sort Options */}
        <View style={styles.sortContainer}>
          <FilterChipList
            chips={sortChips}
            selectedId={sortBy}
            onSelect={(id) => setSortBy(id || 'recent')}
            allowDeselect={false}
            style={styles.sortChips}
          />
        </View>

        {/* Loading State */}
        {isLoading && posts.length === 0 && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>טוען פוסטים...</Text>
          </View>
        )}

        {/* Posts List */}
        <View style={styles.postsContainer}>
          {posts.map((post) => (
            <ForumPostCard
              key={post.id}
              id={post.id}
              author={post.author}
              isAnonymous={post.isAnonymous}
              date={post.date}
              title={post.title}
              content={post.content}
              category={getCategoryInfo(post.categoryId)}
              likes={post.likes}
              comments={post.comments}
              onPress={() => console.log('View post:', post.id)}
              onLike={() => handleLike(post.id)}
              onComment={() => console.log('Comment on post:', post.id)}
            />
          ))}

          {posts.length === 0 && !isLoading && (
            <EmptyState
              iconName="forum-outline"
              title="אין פוסטים להצגה"
              subtitle="היה הראשון לשתף בקהילה!"
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
            saveDisabled={!newPostTitle.trim() || !newPostContent.trim() || isCreating}
          />

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {isCreating && (
              <View style={styles.creatingOverlay}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.creatingText}>מפרסם...</Text>
              </View>
            )}

            {/* Anonymous Toggle */}
            <TouchableOpacity 
              style={styles.anonymousToggle}
              onPress={() => setIsAnonymous(!isAnonymous)}
              activeOpacity={0.8}
            >
              <View style={styles.toggleLeft}>
                <MaterialCommunityIcons
                  name="incognito"
                  size={20}
                  color={colors.text.secondary}
                />
                <Text style={styles.toggleText}>פרסם באופן אנונימי</Text>
              </View>
              <MaterialCommunityIcons
                name={isAnonymous ? "toggle-switch" : "toggle-switch-off"}
                size={40}
                color={isAnonymous ? colors.primary : colors.gray[400]}
              />
            </TouchableOpacity>

            {/* Category Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>בחר קטגוריה</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categorySelection}
              >
                {categories
                  .filter((c) => c.id !== 'all')
                  .map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryOption,
                        { 
                          backgroundColor: category.color + '20',
                          borderWidth: newPostCategory === category.id ? 2 : 0,
                          borderColor: category.color,
                        },
                      ]}
                      onPress={() => setNewPostCategory(category.id)}
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
            <FormInput
              label="כותרת"
              placeholder="הוסף כותרת לפוסט..."
              value={newPostTitle}
              onChangeText={setNewPostTitle}
            />

            {/* Content Input */}
            <FormInput
              label="תוכן הפוסט"
              placeholder="שתף את המחשבות שלך עם הקהילה..."
              value={newPostContent}
              onChangeText={setNewPostContent}
              multiline
              numberOfLines={10}
              minHeight={200}
            />

            {/* Community Guidelines */}
            <InfoBanner
              iconName="shield-check"
              iconColor={colors.success}
              backgroundColor={colors.lightGreen}
              title="כללי הקהילה"
              message="היה מכבד, תומך ואמפטי. זכור שכולנו כאן כדי לעזור אחד לשני."
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
    paddingVertical: 12,
  },
  sortChips: {
    marginBottom: 0,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: colors.text.secondary,
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
  creatingOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: colors.lightPurple,
    borderRadius: 8,
    marginBottom: 16,
  },
  creatingText: {
    marginLeft: 8,
    color: colors.primary,
    fontWeight: '600',
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
