import { StyleSheet } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
  // Common text styles
  textPrimary: {
    color: colors.text.primary,
    fontSize: 16,
  },
  textSecondary: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  textLight: {
    color: colors.text.light,
    fontSize: 12,
  },
  
  // Common layout styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  
  // Common button styles
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.lightPurple,
  },
});

