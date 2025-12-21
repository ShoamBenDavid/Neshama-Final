import React from 'react';
import { View, ScrollView, StyleSheet, I18nManager, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import Screen from '../components/Screen';
import Text from '../components/Text';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import ActionCard from '../components/ActionCard';
import SectionHeader from '../components/SectionHeader';
import HelpFooterButton from '../components/HelpFooterButton';
import colors from '../config/colors';

// Enable RTL layout for Hebrew
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

type DashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;
};

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  return (
    <Screen style={styles.screen}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <MaterialCommunityIcons
              name="white-balance-sunny"
              size={20}
              color={colors.warning}
            />
            <Text style={styles.greeting}>צהריים טובים, שלום</Text>
          </View>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>NESHEMA</Text>
            <MaterialCommunityIcons
              name="star-four-points"
              size={20}
              color={colors.primary}
            />
          </View>
        </View>

        {/* Main Title */}
        <View style={styles.mainTitleContainer}>
          <Text style={styles.mainTitle}>NESHEMA</Text>
          <Text style={styles.subtitle}>
            המרחב הבטוח שלך לרווחה נפשית ותמיכה רגשית
          </Text>
          <View style={styles.badge}>
            <MaterialCommunityIcons
              name="star-four-points"
              size={16}
              color={colors.primary}
            />
            <Text style={styles.badgeText}>MVP Prototype - גרסת ביטא</Text>
          </View>
        </View>

        {/* Statistics Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          style={styles.statsContainer}
          contentContainerStyle={styles.statsContent}
        >
          <StatCard
            icon={
              <MaterialCommunityIcons
                name="shield-check"
                size={24}
                color={colors.white}
              />
            }
            value="1"
            label="הפרעות חרדה"
            backgroundColor={colors.cardBackground}
            iconColor={colors.blue}
          />
          <StatCard
            icon={
              <MaterialCommunityIcons name="calendar" size={24} color={colors.white} />
            }
            value="7/7"
            label="רצפת השבוע"
            backgroundColor={colors.cardBackground}
            iconColor={colors.orange}
          />
          <StatCard
            icon={
              <MaterialCommunityIcons
                name="chart-line"
                size={24}
                color={colors.white}
              />
            }
            value="29%"
            label="הפחתה בחרדה משמעותית"
            backgroundColor={colors.cardBackground}
            iconColor={colors.primary}
          />
          <StatCard
            icon={
              <MaterialCommunityIcons
                name="heart-outline"
                size={24}
                color={colors.white}
              />
            }
            value="5.9/10"
            label="מצב רוח ממוצע"
            backgroundColor={colors.cardBackground}
            iconColor={colors.green}
          />
        </ScrollView>

        {/* Weekly Summary Section */}
        <View style={styles.section}>
          <SectionHeader
            icon={
              <MaterialCommunityIcons
                name="chart-timeline-variant"
                size={20}
                color={colors.primary}
              />
            }
            title="סיכום שבועי"
          />
          <View style={styles.summaryCard}>
            <ProgressBar
              icon={
                <MaterialCommunityIcons
                  name="heart-outline"
                  size={16}
                  color={colors.text.secondary}
                />
              }
              label="מצב רוח ממוצע"
              value="5.9/10"
              progress={59}
              color={colors.green}
            />
            <ProgressBar
              icon={
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={16}
                  color={colors.text.secondary}
                />
              }
              label="רמת חרדה ממוצעת"
              value="29%"
              progress={29}
              color={colors.primary}
            />
            <View style={styles.streakContainer}>
              <Text style={styles.streakText}>🔥</Text>
              <View>
                <Text style={styles.streakTitle}>שבוע מושלם! כל הכבוד</Text>
                <Text style={styles.streakSubtitle}>7 הפעלות השבוע</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Cards Grid */}
        <View style={styles.section}>
          <View style={styles.actionsGrid}>
            <ActionCard
              icon={
                <MaterialCommunityIcons
                  name="account-group"
                  size={24}
                  color={colors.white}
                />
              }
              title="פורום קהילתי"
              subtitle="שיתוף חוויות"
              backgroundColor={colors.lightPink}
              iconColor={colors.pink}
              onPress={() => navigation.navigate('Forum')}
            />
            <ActionCard
              icon={
                <MaterialCommunityIcons
                  name="meditation"
                  size={24}
                  color={colors.white}
                />
              }
              title="תכנים מרגיעים"
              subtitle="תרגילים ותחזיותיות"
              backgroundColor={colors.lightOrange}
              iconColor={colors.orange}
              onPress={() => navigation.navigate('ContentLibrary')}
            />
          </View>
          <View style={styles.actionsGrid}>
            <ActionCard
              icon={
                <MaterialCommunityIcons
                  name="message-text"
                  size={24}
                  color={colors.white}
                />
              }
              title="שיחת תומכת"
              subtitle="ייעוץ עם AI או עוזר"
              backgroundColor={colors.lightTeal}
              iconColor={colors.teal}
              onPress={() => console.log('Chat')}
            />
            <ActionCard
              icon={
                <MaterialCommunityIcons name="book-open" size={24} color={colors.white} />
              }
              title="יומן רגשי"
              subtitle="תעד את הרגשות שלך"
              backgroundColor={colors.lightPurple}
              iconColor={colors.primary}
              onPress={() => navigation.navigate('Journal')}
            />
          </View>
        </View>

        {/* Mood Chart Section */}
        <View style={styles.section}>
          <SectionHeader
            icon={
              <MaterialCommunityIcons
                name="chart-line"
                size={20}
                color={colors.primary}
              />
            }
            title="מפות מצב רוח"
          />
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartPeriod}>14 ימים אחרונים</Text>
              <View style={styles.chartLegend}>
                <View style={[styles.legendItem, { backgroundColor: colors.lightGreen }]}>
                  <Text style={styles.legendText}>גבוהה 9</Text>
                </View>
                <View style={[styles.legendItem, { backgroundColor: colors.lightOrange }]}>
                  <Text style={styles.legendText}>ממוצע 5.9</Text>
                </View>
                <View style={[styles.legendItem, { backgroundColor: colors.lightPink }]}>
                  <Text style={styles.legendText}>נמוכה 2</Text>
                </View>
              </View>
            </View>
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartPlaceholderText}>
                [גרף מצב רוח - ניתן להוסיף ספריית גרפים]
              </Text>
            </View>
          </View>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greeting: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.lightPurple,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  mainTitleContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  mainTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.lightPurple,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  statsContainer: {
    marginVertical: 20,
  },
  statsContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 12,
  },
  streakText: {
    fontSize: 32,
  },
  streakTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  streakSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  chartCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartHeader: {
    marginBottom: 16,
  },
  chartPeriod: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  chartLegend: {
    flexDirection: 'row',
    gap: 8,
  },
  legendItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  legendText: {
    fontSize: 11,
    color: colors.text.primary,
    fontWeight: '600',
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholderText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  bottomSpacing: {
    height: 40,
  },
});

