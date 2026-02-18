import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Text from './Text';
import colors from '../config/colors';

export interface Category {
  id: string;
  label: string;
  color?: string;
}

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export default function CategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {categories.map((category) => {
        const isActive = selectedCategory === category.id;
        return (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.tab,
              isActive && styles.tabActive,
              isActive &&
                category.color && { backgroundColor: category.color },
            ]}
            onPress={() => onSelectCategory(category.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                isActive && styles.tabTextActive,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 50,
  },
  content: {
    paddingHorizontal: 20,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
  },
  tabActive: {
    backgroundColor: colors.danger,
  },
  tabText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.white,
  },
});

