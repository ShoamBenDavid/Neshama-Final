import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import Screen from '../components/Screen';
import Text from '../components/Text';
import SupportCard from '../components/SupportCard';
import EmergencyCard from '../components/EmergencyCard';
import AIChatCard from '../components/AIChatCard';
import BackButton from '../components/BackButton';
import colors from '../config/colors';

type SupportCenterScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SupportCenter'>;
};

interface SupportService {
  id: string;
  title: string;
  subtitle: string;
  phone: string;
  hours?: string;
  available247?: boolean;
  tags: string[];
  website?: string;
  borderColor: string;
}

const supportServices: SupportService[] = [
  {
    id: '1',
    title: 'עַר"ן - עזרה ראשונה נפשית',
    subtitle: 'קו חירום לתמיכה נפשית ראשונה, פעיל 24/7',
    phone: '*2784',
    available247: true,
    tags: ['שיחה אנונימית', 'תמיכה מידית', 'מקצועי ואמפתי'],
    website: 'https://www.eran.org.il',
    borderColor: colors.info,
  },
  {
    id: '2',
    title: 'נט"ל - קו סיוע לנפגעי טראומה',
    subtitle: 'קו סיוע לנפגעי טראומה, לחץ וחרדה',
    phone: '*6787',
    available247: true,
    tags: ['תמיכה רגשית', 'מומחים בטראומה'],
    website: 'https://www.natal.org.il',
    borderColor: colors.purple,
  },
  {
    id: '3',
    title: 'סהר - קו לבנות',
    subtitle: 'קו חם לבני נוער בצוקה',
    phone: '*2771',
    hours: 'ימים א-ה 16:00-00:00, ו׳ 10:00-14:00',
    tags: ['לבני נער', 'אנונימי להקשיע'],
    borderColor: colors.pink,
  },
  {
    id: '4',
    title: 'עמותת לב"ב',
    subtitle: 'קו תמיכה לאנשים המתמודדים עם תחשבות אובדניות',
    phone: '1-800-363-363',
    available247: true,
    tags: ['מניעת אובדנות', 'הקשבה', 'תמיכה לעווה'],
    borderColor: colors.success,
  },
  {
    id: '5',
    title: 'קו הסיוע לאנשים עם דיכאון',
    subtitle: 'קו הסיוע והתמיכה לאנשים הסובלים מדיכאון',
    phone: '1-800-222-033',
    available247: true,
    tags: [],
    borderColor: colors.warning,
  },
];

export default function SupportCenterScreen({ navigation }: SupportCenterScreenProps) {
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
              name="heart-outline"
              size={32}
              color={colors.primary}
            />
            <View style={styles.headerText}>
            <View style={{alignItems: 'flex-start'}}>
              <Text style={styles.headerTitle}>מרכז תמיכה</Text>
            </View>
            </View>
      
          </View>
          <BackButton />
        </View>

        {/* Top Info Card - Mental Health Hotline */}
        <View style={styles.topInfoCard}>
          <View style={styles.topCardHeader}>
            <View style={styles.topCardTitleContainer}>
              <Text style={styles.topCardTitle}>קו המרכז לבריאות הנפש</Text>
              <Text style={styles.topCardSubtitle}>
                מידע וייעוץ בנושאי בריאות הנפש
              </Text>
            </View>
            <TouchableOpacity
              style={styles.topCardPhone}
              onPress={() => console.log('Call *5765')}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="phone"
                size={18}
                color={colors.white}
              />
              <Text style={styles.topCardPhoneText}>*5765</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.topCardHours}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={16}
              color={colors.text.secondary}
            />
            <Text style={styles.topCardHoursText}>
              ימים א-ה 08:00-20:00
            </Text>
          </View>

          <View style={styles.topCardTags}>
            <View style={styles.topCardTag}>
              <Text style={styles.topCardTagText}>ייעוץ</Text>
            </View>
            <View style={styles.topCardTag}>
              <Text style={styles.topCardTagText}>פגישות</Text>
            </View>
            <View style={styles.topCardTag}>
              <Text style={styles.topCardTagText}>מידע מקצועי</Text>
            </View>
          </View>
        </View>

        {/* AI Chat Card */}
        <AIChatCard onPress={() => console.log('Open AI Chat')} />

        {/* Professional Help Section Header */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="heart-outline"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.sectionTitle}>עזרה מקצועית זמינה</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          אנשי מקצוע מוסמכים מוכנים לעזור לך. אל תיכנס לפחות - הכל בר השגה
        </Text>

        {/* Emergency Card */}
        <EmergencyCard />

        {/* Support Services */}
        {supportServices.map((service) => (
          <SupportCard
            key={service.id}
            title={service.title}
            subtitle={service.subtitle}
            phone={service.phone}
            hours={service.hours}
            available247={service.available247}
            tags={service.tags}
            website={service.website}
            borderColor={service.borderColor}
          />
        ))}

        <View style={styles.bottomSpacing} />
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'right',
  },
  topInfoCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  topCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  topCardTitleContainer: {
    flex: 1,
  },
  topCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
    textAlign: 'left',
  },
  topCardSubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
    textAlign: 'left',
  },
  topCardPhone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.teal,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  topCardPhoneText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
  },
  topCardHours: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 12,
    justifyContent: 'flex-start',
  },
  topCardHoursText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  topCardTags: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  topCardTag: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  topCardTagText: {
    fontSize: 11,
    color: colors.text.secondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
    paddingHorizontal: 20,
    marginBottom: 20,
    textAlign: 'right',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});

