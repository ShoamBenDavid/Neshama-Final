import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Text from './Text';
import colors from '../config/colors';

export interface StatItem {
  value: string | number;
  label: string;
  emoji?: string;
}

interface QuickStatsCardProps {
  stats: StatItem[];
  style?: ViewStyle;
}

export default function QuickStatsCard({ stats, style }: QuickStatsCardProps) {
  return (
    <View style={[styles.container, style]}>
      {stats.map((stat, index) => (
        <React.Fragment key={index}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
            {stat.emoji && <Text style={styles.statEmoji}>{stat.emoji}</Text>}
          </View>
          {index < stats.length - 1 && <View style={styles.divider} />}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  statEmoji: {
    fontSize: 20,
  },
  divider: {
    width: 1,
    backgroundColor: colors.gray[200],
    marginHorizontal: 12,
  },
});


