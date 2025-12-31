import React from 'react';
import { View, ScrollView, StyleSheet, I18nManager } from 'react-native';
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
import MoodChart from '../components/MoodChart';
import colors from '../config/colors';

// Enable RTL layout for Hebrew
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

type DashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;
};

// Stats data configuration
const statsData = [
  {
    iconName: 'shield-check' as const,
    value: '1',
    label: 'הפרעות חרדה',
    iconColor: colors.blue,
  },
  {
    iconName: 'calendar' as const,
    value: '7/7',
    label: 'רצפת השבוע',
    iconColor: colors.orange,
  },
  {
    iconName: 'chart-line' as const,
    value: '29%',
    label: 'הפחתה בחרדה משמעותית',
    iconColor: colors.primary,
  },
  {
    iconName: 'heart-outline' as const,
    value: '5.9/10',
    label: 'מצב רוח ממוצע',
    iconColor: colors.green,
  },
];

// Progress bars data
const progressData = [
  {
    iconName: 'heart-outline' as const,
    label: 'מצב רוח ממוצע',
    value: '5.9/10',
    progress: 59,
    color: colors.green,
  },
  {
    iconName: 'alert-circle-outline' as const,
    label: 'רמת חרדה ממוצעת',
    value: '29%',
    progress: 29,
    color: colors.primary,
  },
];

// Chart legend data
const chartLegendData = [
  { label: 'גבוהה 9', backgroundColor: colors.lightGreen },
  { label: 'ממוצע 5.9', backgroundColor: colors.lightOrange },
  { label: 'נמוכה 2', backgroundColor: colors.lightPink },
];

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  // Action cards configuration
  const actionCards = [
    [
      {
        iconName: 'account-group' as const,
        title: 'פורום קהילתי',
        subtitle: 'שיתוף חוויות',
        backgroundColor: colors.lightPink,
        iconColor: colors.pink,
        onPress: () => navigation.navigate('Forum'),
      },
      {
        iconName: 'meditation' as const,
        title: 'תכנים מרגיעים',
        subtitle: 'תרגילים ותחזיותיות',
        backgroundColor: colors.lightOrange,
        iconColor: colors.orange,
        onPress: () => navigation.navigate('ContentLibrary'),
      },
    ],
    [
      {
        iconName: 'message-text' as const,
        title: 'שיחת תומכת',
        subtitle: 'ייעוץ עם AI או עוזר',
        backgroundColor: colors.lightTeal,
        iconColor: colors.teal,
        onPress: () => console.log('Chat'),
      },
      {
        iconName: 'book-open' as const,
        title: 'יומן רגשי',
        subtitle: 'תעד את הרגשות שלך',
        backgroundColor: colors.lightPurple,
        iconColor: colors.primary,
        onPress: () => navigation.navigate('Journal'),
      },
    ],
  ];

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
          {statsData.map((stat, index) => (
            <StatCard
              key={index}
              icon={
                <MaterialCommunityIcons
                  name={stat.iconName}
                  size={24}
                  color={colors.white}
                />
              }
              value={stat.value}
              label={stat.label}
              backgroundColor={colors.cardBackground}
              iconColor={stat.iconColor}
            />
          ))}
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
            {progressData.map((item, index) => (
              <ProgressBar
                key={index}
                icon={
                  <MaterialCommunityIcons
                    name={item.iconName}
                    size={16}
                    color={colors.text.secondary}
                  />
                }
                label={item.label}
                value={item.value}
                progress={item.progress}
                color={item.color}
              />
            ))}
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
          {actionCards.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.actionsGrid}>
              {row.map((card, cardIndex) => (
                <ActionCard
                  key={cardIndex}
                  icon={
                    <MaterialCommunityIcons
                      name={card.iconName}
                      size={24}
                      color={colors.white}
                    />
                  }
                  title={card.title}
                  subtitle={card.subtitle}
                  backgroundColor={card.backgroundColor}
                  iconColor={card.iconColor}
                  onPress={card.onPress}
                />
              ))}
            </View>
          ))}
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
                {chartLegendData.map((item, index) => (
                  <View
                    key={index}
                    style={[styles.legendItem, { backgroundColor: item.backgroundColor }]}
                  >
                    <Text style={styles.legendText}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>
            <MoodChart />
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
  bottomSpacing: {
    height: 40,
  },
});
