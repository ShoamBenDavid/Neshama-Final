import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
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
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logoutUser } from '../store/slices/authSlice';
import { fetchJournalStats } from '../store/slices/journalSlice';

type DashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;
};

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { stats, progress, chartData, isLoading } = useAppSelector((state) => state.journal);

  useEffect(() => {
    dispatch(fetchJournalStats());
  }, [dispatch]);

  const handleLogout = () => {
    Alert.alert(
      'התנתקות',
      'האם אתה בטוח שברצונך להתנתק?',
      [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'התנתק',
          style: 'destructive',
          onPress: () => dispatch(logoutUser()),
        },
      ]
    );
  };

  // Dynamic stats data from server
  const statsData = [
    {
      iconName: 'shield-check' as const,
      value: stats?.anxietyReduction || '0%',
      label: 'הפחתה בחרדה',
      iconColor: colors.blue,
    },
    {
      iconName: 'calendar' as const,
      value: stats?.weeklyStreak || '0/7',
      label: 'רצפת השבוע',
      iconColor: colors.orange,
    },
    {
      iconName: 'chart-line' as const,
      value: String(stats?.totalEntries || 0),
      label: 'רשומות החודש',
      iconColor: colors.primary,
    },
    {
      iconName: 'heart-outline' as const,
      value: stats?.avgMood || '0/10',
      label: 'מצב רוח ממוצע',
      iconColor: colors.green,
    },
  ];

  // Dynamic progress bars data
  const progressData = [
    {
      iconName: 'heart-outline' as const,
      label: 'מצב רוח ממוצע',
      value: stats?.avgMood || '0/10',
      progress: progress?.avgMood || 0,
      color: colors.green,
    },
    {
      iconName: 'alert-circle-outline' as const,
      label: 'רמת חרדה ממוצעת',
      value: stats?.anxietyReduction || '0%',
      progress: progress?.anxietyLevel || 0,
      color: colors.primary,
    },
  ];

  // Dynamic chart legend data
  const chartLegendData = [
    { label: `גבוהה ${chartData?.highMood || 0}`, backgroundColor: colors.lightGreen },
    { label: `ממוצע ${chartData?.avgMood || 0}`, backgroundColor: colors.lightOrange },
    { label: `נמוכה ${chartData?.lowMood || 0}`, backgroundColor: colors.lightPink },
  ];

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
        onPress: () => navigation.navigate('Chat'),
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
            <Text style={styles.greeting}>צהריים טובים, {user?.name || 'שלום'}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <MaterialCommunityIcons
                name="logout"
                size={22}
                color={colors.danger}
              />
            </TouchableOpacity>
           
          </View>
        </View>

        {/* Main Title */}
        <View style={styles.mainTitleContainer}>
          <Text style={styles.mainTitle}>NESHEMA</Text>
          <Text style={styles.subtitle}>
            המרחב הבטוח שלך לרווחה נפשית ותמיכה רגשית
          </Text>
 
        </View>

        {/* Statistics Cards */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : (
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
        )}

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
                <Text style={styles.streakTitle}>
                  {stats?.weeklyStreak === '7/7' ? 'שבוע מושלם! כל הכבוד' : 'המשך כך!'}
                </Text>
                <Text style={styles.streakSubtitle}>
                  {stats?.weeklyStreak?.split('/')[0] || 0} הפעלות השבוע
                </Text>
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoutButton: {
    padding: 8,
    backgroundColor: colors.gray[100],
    borderRadius: 20,
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
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
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
