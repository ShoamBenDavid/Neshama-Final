import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Text from './Text';
import colors from '../config/colors';

export default function EmergencyCard() {
  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="alert-circle"
          size={24}
          color={colors.danger}
        />
        <Text style={styles.title}>במקרה חירום - חייג מיד</Text>
      </View>

      <Text style={styles.warningText}>
        אם אתה או מישהו שאתה מכיר נמצא בסכנה מיידית, אנא פנה מיד לשירותי החירום
      </Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.emergencyButton, styles.mdaButton]}
          onPress={() => handleCall('101')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="phone" size={20} color={colors.white} />
          <Text style={styles.emergencyButtonText}>מד״א - 101</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.emergencyButton, styles.policeButton]}
          onPress={() => handleCall('100')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="phone" size={20} color={colors.danger} />
          <Text style={styles.policeButtonText}>משטרה - 100</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.danger,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
      justifyContent: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.danger,
    textAlign: 'left',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningText: {
    fontSize: 13,
    color: colors.text.primary,
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'left',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  emergencyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  mdaButton: {
    backgroundColor: colors.danger,
  },
  policeButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.danger,
  },
  emergencyButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'left',
  },
  policeButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.danger,
  },
});

