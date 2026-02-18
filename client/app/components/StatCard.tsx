import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from './Text';
import colors from '../config/colors';

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  backgroundColor: string;
  iconColor: string;
}

export default function StatCard({
  icon,
  value,
  label,
  backgroundColor,
  iconColor,
}: StatCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
        {icon}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

