import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Text from './Text';
import colors from '../config/colors';

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  backgroundColor: string;
  iconColor: string;
  onPress: () => void;
}

export default function ActionCard({
  icon,
  title,
  subtitle,
  backgroundColor,
  iconColor,
  onPress,
}: ActionCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
        {icon}
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Text style={styles.buttonText}>התחל {'>'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    minHeight: 160,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    flex: 1,
    margin: 6,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'left',
  },
  buttonContainer: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});

